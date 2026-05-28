// backend/src/controllers/webhookController.js
import Chat from '../models/Chat.js'; 
import Tenant from '../models/Tenant.js';

/**
 * Verificación del Webhook (Método GET)
 * Meta nos pega acá para validar que nuestro servidor es seguro y real.
 */
export const verifyWebhook = async (req, res) => {
  try {
    // Meta manda estos parámetros en la Query String
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // El token secreto que nosotros elegimos (lo vamos a poner en el .env)
    const MY_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto_vip';

    if (mode && token) {
      if (mode === 'subscribe' && token === MY_VERIFY_TOKEN) {
        console.log('✅ WEBHOOK_VERIFIED: ¡Conexión con Meta exitosa!');
        // Respondemos con el challenge que nos mandaron para confirmar
        return res.status(200).send(challenge);
      } else {
        // Si el token no coincide, se rechaza
        console.log('❌ WEBHOOK_REFUSED: El token de verificación no coincide.');
        return res.sendStatus(403);
      }
    }
  } catch (error) {
    console.error('Error en la verificación del webhook:', error);
    return res.sendStatus(500);
  }
};

/**
 * Recepción de Mensajes de WhatsApp (Método POST)
 * Meta nos dispara un POST acá cada vez que un cliente envía un mensaje.
 */
export const receiveMessage = async (req, res) => {
  try {
    const body = req.body;
    console.log('📩 Mensaje recibido de Meta:', JSON.stringify(body, null, 2));

    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messageData = value?.messages?.[0];
    const contactData = value?.contacts?.[0];

    if (!messageData || messageData.type !== 'text') {
      return res.status(200).send('EVENT_RECEIVED');
    }

    const customerPhone = messageData.from;
    const customerName = contactData?.profile?.name || 'Cliente de WhatsApp';
    const messageBody = messageData.text?.body;
    const messageId = messageData.id;
    const timestamp = messageData.timestamp;

    // 2. Capturamos el ID de teléfono que Meta nos envía en el JSON
    const metaPhoneNumberId = value?.metadata?.phone_number_id;

    console.log(`🔍 Buscando a qué comercio pertenece el ID de WhatsApp: ${metaPhoneNumberId}...`);

    // 3. Buscamos en la colección de Tenants cuál coincide con ese phoneNumberId
    let tenant = await Tenant.findOne({ 'whatsappConfig.phoneNumberId': metaPhoneNumberId });

    // PLAN B PARA PRUEBAS: Si no encontrás ningún Tenant en tu base de datos todavía,
    // creamos uno rápido al vuelo para que no tire el error de ObjectId y la app no se clave.
    if (!tenant) {
      console.log(`⚠️ No se encontró un Tenant con el ID ${metaPhoneNumberId}. Creando uno de prueba...`);
      tenant = await Tenant.create({
        name: "Tienda de Prueba Maury",
        businessEmail: "prueba@maurydev.com", // Ponemos uno único por su restriction unique: true
        plan: "free",
        status: "active",
        whatsappConfig: {
          phoneNumberId: metaPhoneNumberId || "987654321",
          wabaId: "waba_mock_123",
          accessToken: "token_mock_123"
        }
      });
    }

    console.log(`💾 Guardando mensaje en el chat del Tenant: ${tenant.name} (_id: ${tenant._id})`);

    // Armamos el objeto del mensaje formateando correctamente la fecha
    const nuevoMensajeObj = {
      sender: 'customer',
      text: messageBody,
      timestamp: timestamp ? new Date(parseInt(timestamp) * 1000) : new Date()
    };

    // 4. Ahora sí, usamos el tenant._id que es un ObjectId real y válido de MongoDB
    const updatedChat = await Chat.findOneAndUpdate(
      { 
        tenantId: tenant._id, // <─── Usamos el ID correcto del documento encontrado
        customerPhone: customerPhone 
      },
      {
        $setOnInsert: {
          customerName: customerName,
          status: 'bot_active' // Cambiado a tu enum por defecto del esquema
        },
        $push: {
          messages: nuevoMensajeObj // <─── Pasamos el objeto limpio configurado arriba
        },
        $set: {
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after', // <─── Esto reemplaza al 'new: true' en las versiones nuevas
        upsert: true 
      }
    );

    console.log(`✅ Registro guardado exitosamente en Mongo. Chat ID del sistema: ${updatedChat._id}`);

    // 🚀 EMISIÓN DE WEBCOCKET EN TIEMPO REAL
    // Rescatamos la instancia global de 'io' que dejamos colgada de la 'app' en index.js
    const io = req.app.get('io');
    if (io) {
      console.log(`📡 Emitiendo newMessage vía Socket para tenant: ${tenant._id}`);
      io.emit('newMessage', {
        tenantId: tenant._id.toString(), // Convertimos el ObjectId a string plano para Zustand
        customerPhone: customerPhone,
        message: nuevoMensajeObj
      });
    }

    return res.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('❌ Error crítico al procesar y guardar el mensaje:', error);
    return res.status(200).send('EVENT_RECEIVED_WITH_ERROR');
  }
};