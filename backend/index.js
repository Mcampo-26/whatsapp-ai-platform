import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { dbConnect } from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";

// Configuración inicial de entorno
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales obligatorios
app.use(cors());
app.use(express.json()); // Clave para leer los JSON entrantes de Meta

// Conexión a la base de datos MongoDB Atlas
dbConnect();

// Crear servidor HTTP unificado e inicializar WebSockets con el helper modular
const httpServer = createServer(app);
initSocket(httpServer);

// Rutas base de la API comercial
app.use("/api", webhookRoutes);
app.use("/api/chats", chatRoutes);

// Endpoint de control de salud del sistema (Health Check)
app.get("/", (req, res) => {
  res.send("Servidor de WhatsApp AI Platform corriendo exitosamente 🚀");
});

// Levantar el servidor integrado en el puerto configurado
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido con WebSockets en http://localhost:${PORT}`);
});