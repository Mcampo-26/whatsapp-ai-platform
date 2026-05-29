// backend/src/routes/chatRoutes.js
import express from 'express';
import { getChatsByTenant,sendMessageByAgent } from '../controllers/chatController.js';

const router = express.Router();

// Definimos el parámetro dinámico :tenantId
router.get('/tenant/:tenantId', getChatsByTenant);
router.post('/:chatId/message', sendMessageByAgent);

export default router;