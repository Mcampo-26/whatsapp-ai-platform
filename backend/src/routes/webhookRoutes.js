// backend/src/routes/webhookRoutes.js
import express from 'express';
import { verifyWebhook, receiveMessage } from '../controllers/webhookController.js';

const router = express.Router();

// Ruta de verificación (GET)
router.get('/webhook', verifyWebhook);

// Ruta de recepción de datos (POST)
router.post('/webhook', receiveMessage);

export default router;