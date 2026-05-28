// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http'; // 🚀 Agregado para soportar Sockets sin romper Express
import { Server } from 'socket.io';   // 🚀 Agregado para la comunicación en tiempo real
import mongoose from 'mongoose';
import webhookRoutes from './src/routes/webhookRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js'; // 🚀 Enlace de rutas de chat que agregamos antes
import { dbConnect } from './src/config/db.js';

// Cargar variables de entorno
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json()); 
dbConnect();// Clave para leer los JSON que mandará Meta mas adelante

// 🚀 Crear el servidor HTTP acoplado con Express y configurar Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Tu origen del Frontend de Vite
    methods: ["GET", "POST"]
  }
});

// 🚀 Guardar la instancia de io en la app para poder usarla en tus controladores
app.set('io', io);

// Monitorear conexiones de sockets en consola
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado al socket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado del socket: ${socket.id}`);
  });
});

// Enlazar las rutas del webhook bajo el prefijo /api
app.use('/api', webhookRoutes);
app.use('/api/chats', chatRoutes); // 🚀 Enlace de rutas de chat activas

// Ruta de prueba por si querés entrar desde el navegador
app.get('/', (req, res) => {
  res.send('Servidor de WhatsApp AI Platform corriendo exitosamente 🚀');
});

// Levantar el servidor y dejarlo escuchando
// 🚀 CRITICAL: Ahora escucha httpServer en lugar de app.listen para habilitar los Sockets
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en http://localhost:${PORT}`);
});