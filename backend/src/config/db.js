// backend/src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI; // Asegurate que en tu .env la variable se llame exactamente MONGODB_URI
    
    if (!uri) {
      throw new Error('La URI de conexión no está definida en el archivo .env');
    }
    
    await mongoose.connect(uri);
    console.log('🍃 Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error);
    process.exit(1); // Cerramos el proceso si no se puede conectar a la base de datos
  }
};