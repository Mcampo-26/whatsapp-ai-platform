const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para saber que el servidor responde
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor corriendo perfecto' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend encendido en http://localhost:${PORT}`);
});