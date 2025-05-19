import Chatbot from './Chatbot.js';

class ProxyChatbot {
  constructor(chatbot) {
    this.chatbot = chatbot;
  }
  
  async processarConsulta(texto) {
    // Validación como en tu diagrama
    if (!texto || texto.trim().length < 2) {
      return this.solicitarReformulacion();
    }
    
    try {
      const respuesta = await this.enviarDatos(texto);
      return this.devolverRespuesta(respuesta);
    } catch (error) {
      console.error("Error en Proxy:", error);
      const soporte = this.chatbot.obtenerSoporte();
      return `${this.solicitarReformulacion()} O contacta a: ${soporte[0]}`;
    }
  }
  
  enviarDatos(texto) {
    // Simulación de API externa
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Respuesta a: ${texto}`);
      }, 500);
    });
  }
  
  solicitarReformulacion() {
    return "No entendí, ¿puedes reformular tu pregunta?";
  }
  
  devolverRespuesta(respuesta) {
    return respuesta;
  }
}

export default ProxyChatbot;
