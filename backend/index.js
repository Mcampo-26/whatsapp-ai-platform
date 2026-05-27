// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import webhookRoutes from './src/routes/webhookRoutes.js';
import { dbConnect } from './src/config/db.js'

// Cargar variables de entorno
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json()); 
dbConnect();// Clave para leer los JSON que mandará Meta mas adelante

// Enlazar las rutas del webhook bajo el prefijo /api
app.use('/api', webhookRoutes);

// Ruta de prueba por si querés entrar desde el navegador
app.get('/', (req, res) => {
  res.send('Servidor de WhatsApp AI Platform corriendo exitosamente 🚀');
});

// Levantar el servidor y dejarlo escuchando
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en http://localhost:${PORT}`);
});