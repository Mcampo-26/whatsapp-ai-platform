// backend/src/controllers/chatController.js
// Importá tu modelo de Chat (ajustá la ruta si tu archivo de modelos se llama distinto)
import Chat from '../models/Chat.js'; 

export const getChatsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Buscamos todos los chats que pertenezcan a este tenantId
    const chats = await Chat.find({ tenantId }).sort({ updatedAt: -1 });

    // Le respondemos al frontend con la lista real de la base de datos
    return res.status(200).json(chats);
  } catch (error) {
    console.error('Error en getChatsByTenant:', error);
    return res.status(500).json({ message: 'Error interno al obtener los chats' });
  }
};