// backend/src/services/geminiService.js
import { GoogleGenAI } from '@google/genai';

export const generateBotResponse = async (customerMessage, tenantName = "Nuestro Comercio") => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('tu_api_key_real')) {
      console.warn("⚠️ GEMINI_API_KEY no configurada. Usando respuesta mock.");
      // Limpiamos la respuesta de contingencia para que sea corta y no se coma los tokens
      return `¡Hola! Gracias por comunicarte con ${tenantName}. En breve un asesor te responderá.`;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `
      Sos un asistente virtual automatizado de atención al cliente para la tienda "${tenantName}".
      Tu objetivo es responder de forma amable, cortés, clara y muy concisa (máximo 2 o 3 oraciones).
      Usa modismos de Argentina de forma profesional pero cercana.
      Si no sabes la respuesta a algo específico sobre stock o precios, decile que un asesor humano lo va a contactar a la brevedad.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: customerMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800 // 🚀 SUBIMOS LOS TOKENS para que la IA pueda explayarse y terminar las oraciones completas
      }
    });

    return response.text.trim();

  } catch (error) {
    console.error('❌ Error en geminiService:', error);
    return "Disculpame, en este momento estoy experimentando una pequeña demora. Un asesor se comunicará con vos de inmediato.";
  }
};