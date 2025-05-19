import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Importación desde módulo API
import { queryRAG } from './API/gptAPI.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// ✅ Servir archivos estáticos desde 'Public' (html, css, etc.)
app.use(express.static(path.join(__dirname, 'Public')));

// ✅ Servir archivos estáticos desde 'API' (JS del lado cliente si es necesario)
app.use(
  '/api',
  express.static(path.join(__dirname, 'API'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  })
);

// ✅ Servir archivos estáticos desde 'src' (JS frontend como controladores, vistas, etc.)
app.use(
  '/src',
  express.static(path.join(__dirname, 'src'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  })
);

// ✅ Ruta POST para la IA del chatbot
app.post('/api/query', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: "Se requiere un 'prompt' válido" });
    }

    console.log(`Recibida pregunta: "${prompt}"`);
    const response = await queryRAG(prompt);
    res.json({ answer: response });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      message: error.message 
    });
  }
});

// ✅ Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// ✅ Ruta 404 para todo lo demás
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// ✅ Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
