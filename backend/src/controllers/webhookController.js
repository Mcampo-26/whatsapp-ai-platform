// backend/src/controllers/webhookController.js
import Chat from '../models/Chat.js'; 
import Tenant from '../models/Tenant.js';
import { handleBotAutomationFlow } from '../services/botFlowService.js'; // 🚀 Servicio modular de la IA
import { getIO } from '../config/socket.js'; // 🚀 Importación limpia desde nuestro helper global

/**
 * Verificación del Webhook (Método GET)
 * Meta nos pega acá para validar que nuestro servidor es seguro y real.
 */
export const verifyWebhook = async (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const MY_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto_vip';

    if (mode && token) {
      if (mode === 'subscribe' && token === MY_VERIFY_TOKEN) {
        console.log('✅ WEBHOOK_VERIFIED: ¡Conexión con Meta exitosa!');
        return res.status(200).send(challenge);
      } else {
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
 * Meta nos dispara un POST acá cada vez que un cliente envía un mensaje o responde Gemini.
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

    const metaPhoneNumberId = value?.metadata?.phone_number_id;

    console.log(`🔍 Buscando a qué comercio pertenece el ID de WhatsApp: ${metaPhoneNumberId}...`);

    let tenant = await Tenant.findOne({ 'whatsappConfig.phoneNumberId': metaPhoneNumberId });

    if (!tenant) {
      console.log(`⚠️ No se encontró un Tenant con el ID ${metaPhoneNumberId}. Creando uno de prueba...`);
      tenant = await Tenant.create({
        name: "Tienda de Prueba Maury",
        businessEmail: "prueba@maurydev.com",
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

    const updatedChat = await Chat.findOneAndUpdate(
      { 
        tenantId: tenant._id, 
        customerPhone: customerPhone 
      },
      {
        $setOnInsert: {
          customerName: customerName,
          status: 'bot_active'
        },
        $push: {
          messages: nuevoMensajeObj
        },
        $set: {
          updatedAt: new Date()
        }
      },
      { 
        returnDocument: 'after', 
        upsert: true 
      }
    );

    console.log(`✅ Registro guardado exitosamente en Mongo. Chat ID del sistema: ${updatedChat._id}`);

    // 🚀 EMISIÓN DE WEBCOCKET EN TIEMPO REAL (Mensaje del Cliente)
    const io = getIO();
    const tenantString = tenant._id.toString();

    if (io) {
      console.log(`📡 Emitiendo newMessage vía Socket para tenant: ${tenantString}`);
      io.to(tenantString).emit('newMessage', {
        tenantId: tenantString,
        customerPhone: customerPhone,
        chatId: updatedChat._id,
        message: nuevoMensajeObj
      });
    }

    // 🧠 CANDADO DE IA INTERACTIVO: Evaluamos el status actual devuelto por Atlas antes de procesar Gemini
    if (updatedChat && updatedChat.status === 'agent_active') {
      console.log(`🛑 [BotFlow] Automatización omitida: El operador tiene el control manual para el cliente ${customerPhone}.`);
    } else {
      // 🤖 Si no está en modo manual, dejamos pasar libremente el flujo de automatización en segundo plano
      console.log(`🧠 [BotFlow] Iniciando automatización de IA con Gemini para ${tenant.name}...`);
      handleBotAutomationFlow(io, tenant, customerPhone, messageBody);
    }

    return res.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('❌ Error crítico al procesar y guardar el mensaje:', error);
    return res.status(200).send('EVENT_RECEIVED_WITH_ERROR');
  }
};