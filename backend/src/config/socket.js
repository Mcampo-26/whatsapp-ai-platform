// backend/src/config/socket.js
import { Server } from 'socket.io';

let io = null;

// Se ejecuta una sola vez cuando arranca el servidor en tu index.js/server.js
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173", // Ajustá a tu puerto de Vite
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado al socket: ${socket.id}`);

    // Canal por tienda (Tenant) para no mezclar los chats de distintos comercios
    socket.on('joinTenant', (tenantId) => {
      socket.join(tenantId);
      console.log(`🏢 Socket ${socket.id} se unió al Tenant Room: ${tenantId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado del socket: ${socket.id}`);
    });
  });

  return io;
};

// 🚀 LA MAGIA: Esta función la importás en cualquier controlador para emitir en vivo
export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io no ha sido inicializado. Ejecutá initSocket primero.");
  }
  return io;
};