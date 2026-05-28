// backend/src/services/botFlowService.js
import Chat from '../models/Chat.js';
import { generateBotResponse } from './geminiService.js';

export const handleBotAutomationFlow = async (io, tenant, customerPhone, incomingMessageText) => {
  try {
    console.log(`🧠 [BotFlow] Iniciando automatización de IA con Gemini para ${tenant.name}...`);

    // 1. Llamamos al servicio de Gemini para redactar la respuesta inteligente
    const botTextResponse = await generateBotResponse(incomingMessageText, tenant.name);

    // 2. Estructuramos el mensaje del bot respetando tu esquema de base de datos
    const mensajeBotObj = {
      sender: 'bot',
      text: botTextResponse,
      timestamp: new Date()
    };

    // 3. Salvamos la respuesta en caliente en MongoDB Atlas
    await Chat.findOneAndUpdate(
      { tenantId: tenant._id, customerPhone: customerPhone },
      {
        $push: { messages: mensajeBotObj },
        $set: { updatedAt: new Date() }
      }
    );
    console.log(`💾 [BotFlow] Respuesta de Gemini guardada de forma segura en Mongo.`);

    // 4. Emitimos el evento de Socket para actualizar el Frontend instantáneamente sin F5
    if (io) {
      console.log(`📡 [BotFlow] Emitiendo respuesta del Bot vía Socket en tiempo real.`);
      io.emit('newMessage', {
        tenantId: tenant._id.toString(),
        customerPhone: customerPhone,
        message: mensajeBotObj
      });
    }

  } catch (error) {
    console.error('❌ Error crítico en el flujo automatizado del Bot:', error);
  }
};