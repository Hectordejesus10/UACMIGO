import Chatbot from '../models/Chatbot.js';
import ChatbotView from '../views/ChatbotView.js';
import SoporteTecnico from '../models/SoporteTecnico.js';



class ChatbotController {
  constructor() {
    console.log("Inicializando ChatbotController...");
    this.chatbot = Chatbot.getInstance();
    this.view = new ChatbotView();
    this.initialize();
  }

  initialize() {
    if (!this.verifyEssentialElements()) {
      console.error("No se pueden inicializar los event listeners - elementos faltantes");
      return;
    }

    this.setupEventListeners();
    this.showWelcomeMessage();
    console.log("Controlador inicializado correctamente");
  }

  showWelcomeMessage() {
  this.view.mostrarMensaje("Hola, ¿en qué puedo ayudarte hoy?", false);
  }


  returnToMainMenu() {
    console.log("Regresando al menú principal");
    this.view.showMainMenu();
    this.view.clearChat();
  }

  verifyEssentialElements() {
    const elements = {
      faqCards: document.querySelectorAll('.faq-card'),
      directChatBtn: document.getElementById('directChatBtn'),
      sendButton: document.getElementById('sendButton'),
      userInput: document.getElementById('userInput')
    };

    let allElementsPresent = true;

    if (elements.faqCards.length === 0) {
      console.error("No se encontraron tarjetas FAQ");
      allElementsPresent = false;
    }

    if (!elements.directChatBtn) {
      console.error("No se encontró el botón de chat directo");
      allElementsPresent = false;
    }

    if (!elements.sendButton) {
      console.error("No se encontró el botón de enviar");
      allElementsPresent = false;
    }

    if (!elements.userInput) {
      console.error("No se encontró el input de usuario");
      allElementsPresent = false;
    }

    return allElementsPresent;
  }

  setupEventListeners() {
    // 1. Botón de volver al menú
    if (this.view.backToMenuBtn) {
      this.view.backToMenuBtn.addEventListener('click', () => {
        this.returnToMainMenu();
      });
    }

    // 2. Evento para las tarjetas FAQ
    document.querySelectorAll('.faq-card').forEach(card => {
      card.addEventListener('click', () => {
        const pregunta = card.getAttribute('data-pregunta');
        if (pregunta) this.handleQuestionClick(pregunta);
      });
    });

    // 3. Botón de chat directo
    document.getElementById('directChatBtn').addEventListener('click', () => {
      console.log("Botón de chat directo clickeado");
      this.handleDirectChat();
    });

    // 4. Botón de enviar
    document.getElementById('sendButton').addEventListener('click', () => {
      this.handleUserInput();
    });

    // 5. Enter en el input
    document.getElementById('userInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserInput();
      }
    });

    console.log("Event listeners configurados correctamente");
  }


  handleQuestionClick(pregunta) {
    console.log("Procesando pregunta:", pregunta);
    this.view.ocultarPanelFAQ(); // Método renombrado
    this.view.mostrarAreaChat();
    this.processQuestion(pregunta);
  }

  returnToMainMenu() {
    console.log("Regresando al menú principal");
    this.view.mostrarMainMenu(); // Método renombrado
    this.view.clearChat();
  }

  handleDirectChat() {
    console.log("Iniciando chat directo");
    this.view.ocultarPanelFAQ(); // Método renombrado
    this.view.mostrarAreaChat();
    this.view.focusInput();
  }

async handleUserInput() {
  const inputText = this.view.userInput.value.trim();
  console.log("Texto ingresado por usuario:", inputText);
  
  if (!inputText) return; // No hacer nada si está vacío
  
  // Verificar si es igual a la última pregunta
  if (this.lastQuestion && inputText.toLowerCase() === this.lastQuestion.toLowerCase()) {
    this.view.mostrarMensaje("Ya estoy procesando tu pregunta, por favor espera...", false);
    return;
  }
  
  this.lastQuestion = inputText; // Guardar la última pregunta
  
  // Mostrar el mensaje del usuario inmediatamente
  this.view.ocultarPanelFAQ();
  this.view.mostrarAreaChat();
  this.view.mostrarMensaje(inputText, true);
  this.view.clearInput();
  
  // Primero verificar si es un saludo o texto no válido
  if (this.isGreeting(inputText) || !this.isValidQuestion(inputText)) {
    this.handleSpecialCases(inputText);
    return;
  }

  // Si es una pregunta válida, procesar con la API
  await this.processQuestion(inputText);
}

// Método mejorado para manejar casos especiales
handleSpecialCases(inputText) {
  const lowerInput = inputText.toLowerCase().trim();
  
  // Respuestas para saludos
  if (this.isGreeting(inputText)) {
    const greetingsResponses = [
      "¡Hola! ¿En qué puedo ayudarte hoy?",
      "¡Hola! ¿Cómo estás? Cuéntame, ¿qué necesitas?",
      "¡Hola! 😊 Estoy aquí para ayudarte. ¿En qué puedo asistirte?",
      "¡Holi! ✨ ¿Qué te gustaría saber hoy?"
    ];
    const randomResponse = greetingsResponses[Math.floor(Math.random() * greetingsResponses.length)];
    this.view.mostrarMensaje(randomResponse, false);
    return;
  }
  
  // Respuesta para texto no válido (números, símbolos, etc.)
  if (!this.isValidQuestion(inputText)) {
    const invalidResponses = [
      "No entendí tu mensaje. ¿Podrías formular una pregunta más clara?",
      "Parece que no has formulado una pregunta. ¿En qué puedo ayudarte?",
      "¿Podrías ser más específico? No logro entender tu consulta.",
      "No reconozco eso como una pregunta válida. ¿Te refieres a algo en particular?"
    ];
    const randomResponse = invalidResponses[Math.floor(Math.random() * invalidResponses.length)];
    this.view.mostrarMensaje(randomResponse, false);
  }
}

// Método mejorado para detectar saludos
isGreeting(text) {
  const greetings = [
    "hola", "holi", "holis", "holaa", "holaaa", 
    "buenos días", "buenas tardes", "buenas noches", 
    "hi", "hello", "hey", "saludos", "qué tal", "que tal"
  ];
  
  const normalizedText = text.toLowerCase().trim().replace(/[^\w\s]/g, ""); // Elimina puntuación
  
  return greetings.some(greeting => normalizedText.startsWith(greeting));
}

// Método mejorado para validar preguntas
isValidQuestion(question) {
  question = question.trim();
  
  // Si es un saludo, no es pregunta válida
  if (this.isGreeting(question)) return false;
  
  // Validaciones mejoradas
  if (question.length < 3) return false; // Reducido a 3 caracteres mínimo
  if (question.length > 200) return false;
  
  // No solo signos de puntuación o espacios
  if (/^[\s?¿¡!.,;:-]+$/.test(question)) return false;
  
  // Debe contener al menos 2 letras (no solo números/símbolos)
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}/.test(question)) return false;
  
  // No solo números
  if (/^\d+$/.test(question)) return false;
  
  return true;
}

async processQuestion(question) {
  try {
    // Validación mejorada
    if (!this.isValidQuestion(question)) {
      this.view.mostrarMensaje("Por favor escribe una pregunta más clara (mínimo 4 caracteres)", false);
      return;
    }

    this.view.mostrarCargando();
 
    
    const response = await fetch('http://localhost:3000/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question })
    });
    this.view.ocultarCargando();
    const data = await response.json();
    
    if (!response.ok) {
      // Manejo específico para error 429
      if (response.status === 429) {
        throw new Error("Estamos experimentando alta demanda. Por favor intenta más tarde.");
      }
      throw new Error(data.error || "Error al procesar tu pregunta");
    }

    if (!data.answer) {
      throw new Error("No se recibió una respuesta válida");
    }

    this.view.mostrarMensaje(data.answer, false);
    
  } catch (error) {
    this.view.ocultarCargando();
    console.error('Error al procesar pregunta:', error);
    
    
    // Mensajes de error específicos
    const mensajeError = error.message.includes("alta demanda")
      ? error.message
      : "Lo siento, ocurrió un error, intenta mas tarde.";
    
    this.view.mostrarMensaje(mensajeError, false);

    // Obtener información de soporte técnico
    const contactos = SoporteTecnico.obtenerContactos();
    const ubicaciones = SoporteTecnico.obtenerUbicaciones();
    
    // Construir mensaje de soporte
    let mensajeSoporte = "\n\n📞 Por favor contacta al area responsable:";
    mensajeSoporte += `\n- ${contactos.join("\n- ")}`;
    mensajeSoporte += `\n\n📍 Ubicaciones: ${ubicaciones.join(", ")}`;
    mensajeSoporte += "\n\nEstaremos encantados de ayudarte.";
    
    this.view.mostrarMensaje(mensajeSoporte, false);
    
  } finally {
    this.view.ocultarCargando();
  }
}
}
// Al final de ChatbotController.js (fuera de la clase)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado - iniciando controlador");
    new ChatbotController();
  });
}

export default ChatbotController;
