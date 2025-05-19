import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera embeddings para un texto dado
 * @param {string} text - Texto a convertir en embedding
 * @returns {Promise<Array<number>>} - Array de números representando el embedding
 */
export const embedText = async (text) => {
  try {
    const response = await openai.embeddings.create({
      input: text,
      model: "text-embedding-ada-002"
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error al generar embeddings:", error);
    throw error;
  }
};

/**
 * Consulta el modelo de OpenAI con un prompt y contexto
 * @param {string} prompt - Pregunta del usuario
 * @param {string} [context=''] - Contexto adicional
 * @returns {Promise<string>} - Respuesta del modelo
 */
export const queryRAG = async (prompt, context = '') => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL_NAME || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un asistente de la UACM. Responde basado en el contexto (máximo${process.env.MAX_TOKENS || 45} tokens):\n\n${context}\n\nSi no sabes la respuesta, di que no tienes esa información.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.MAX_TOKENS) || 45,
      temperature: 0.5
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error en OpenAI API:", error);
    throw error;
  }
};

// Exportaciones explícitas
export default {
  embedText,
  queryRAG
};