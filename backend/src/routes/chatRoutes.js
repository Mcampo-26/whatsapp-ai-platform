// backend/src/routes/chatRoutes.js
import express from 'express';
import { 
  getChatsByTenant, 
  sendMessageByAgent, 
  toggleChatBotStatus 
} from '../controllers/chatController.js';

const router = express.Router();

// Obtener todos los chats de un comercio específico
router.get('/tenant/:tenantId', getChatsByTenant);

// Enviar un mensaje manual desde el panel del operador
router.post('/:chatId/message', sendMessageByAgent);

// 🚀 CORREGIDO: Ruta limpia con el método PATCH, parámetro dinámico y su controlador asignado
router.patch('/:chatId/toggle-bot', toggleChatBotStatus);

export default router;