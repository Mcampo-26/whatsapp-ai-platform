// backend/src/controllers/chatController.js
import Chat from '../models/Chat.js'; 
import { getIO } from '../config/socket.js'; // 🚀 Importación limpia desde el helper con su extensión .js

export const getChatsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const chats = await Chat.find({ tenantId }).sort({ updatedAt: -1 });
    return res.status(200).json(chats);
  } catch (error) {
    console.error('Error en getChatsByTenant:', error);
    return res.status(500).json({ message: 'Error interno al obtener los chats' });
  }
};

export const sendMessageByAgent = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'El texto del mensaje es requerido' });
    }

    // 1. Persistencia en base de datos
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            sender: 'agent',
            text: text.trim(),
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat no encontrado' });
    }

    // 2. Emisión en tiempo real usando el Helper global desvinculado de HTTP
    const io = getIO();
    const tenantString = updatedChat.tenantId.toString();
    
    console.log(`📡 Operador envió mensaje. Emitiendo agentMessage vía Socket para tenant: ${tenantString}`);
    
    io.to(tenantString).emit('newMessage', {
      chatId: updatedChat._id,
      message: updatedChat.messages[updatedChat.messages.length - 1]
    });

    return res.status(200).json(updatedChat);

  } catch (error) {
    console.error('❌ Error en sendMessageByAgent:', error);
    return res.status(500).json({ message: 'Error interno al enviar el mensaje del agente' });
  }
};