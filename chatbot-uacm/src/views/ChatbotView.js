class ChatbotView {
  constructor() {
    this.initElements();
    this.validateElements();
    this.setupEventListeners();
    this.loadingInterval = null; // Variable de instancia para el intervalo

  }

  initElements() {
    // Elementos principales
    this.chatBox = document.getElementById('chat-box');
    this.userInput = document.getElementById('userInput');
    this.sendButton = document.getElementById('sendButton');
    this.directChatBtn = document.getElementById('directChatBtn');
    this.backToMenuBtn = document.getElementById('backToMenuBtn');
    this.loadingIndicator = document.getElementById('loading-indicator');
    
    // Paneles
    this.faqContainer = document.getElementById('faqContainer');
    this.chatArea = document.getElementById('chatArea');
    this.welcomeMessage = document.getElementById('welcomeMessage');
    
    // Estado
    this.loadingIndicator = document.getElementById('loadingIndicator');
    this.faqCards = document.querySelectorAll('.faq-card');
  }

  /* ========== MÉTODOS BÁSICOS DE INTERFAZ ========== */

  mostrarMensaje(texto, esUsuario) {
    if (!this.chatBox || !texto) return;
    
    const mensaje = document.createElement('div');
    mensaje.className = `message ${esUsuario ? 'user-message' : 'bot-message'}`;
    
    const contenido = document.createElement('div');
    contenido.className = 'message-content';
    contenido.textContent = texto;
    
    const hora = document.createElement('div');
    hora.className = 'message-time';
    hora.textContent = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    mensaje.appendChild(contenido);
    mensaje.appendChild(hora);
    this.chatBox.appendChild(mensaje);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatBox) {
      this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }
  }

  focusInput() {
    if (this.userInput) {
      this.userInput.focus();
      this.userInput.placeholder = "Escribe tu pregunta aquí...";
    }
  }

  clearInput() {
    if (this.userInput) {
      this.userInput.value = '';
    }
  }

  clearChat() {
    if (this.chatBox) {
      this.chatBox.innerHTML = '';
    }
  }



  mostrarError(mensaje) {
    const errorElement = document.createElement('div');
    errorElement.className = 'message bot-message error-message';
    errorElement.innerHTML = `
      <div class="message-content">${mensaje}</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    this.chatBox.appendChild(errorElement);
    this.scrollToBottom();
  }


  /* ========== MANEJO DE PANELES ========== */

  ocultarPanelFAQ() {
    if (this.faqContainer) this.faqContainer.style.display = 'none';
    if (this.welcomeMessage) this.welcomeMessage.style.display = 'none';
  }

  mostrarMainMenu() {
    if (this.faqContainer) this.faqContainer.style.display = 'flex';
    if (this.welcomeMessage) this.welcomeMessage.style.display = 'block';
    if (this.chatArea) this.chatArea.style.display = 'none';
    if (this.backToMenuBtn) this.backToMenuBtn.style.display = 'none';

    this.clearChat();
  }

  clearChat(keepWelcome = false) {
  if (this.chatBox) {
    if (keepWelcome) {
      // Eliminar todos los mensajes excepto el de bienvenida
      const messages = this.chatBox.querySelectorAll('.message:not(.welcome-message)');
      messages.forEach(msg => msg.remove());
    } else {
      // Limpieza completa
      this.chatBox.innerHTML = '';
      this.mostrarMensaje("Hola, ¿En qué puedo ayudarte hoy?", false);
      document.querySelector('.message').classList.add('welcome-message');
    }
  }
}


  mostrarAreaChat() {
    if (this.faqContainer) this.faqContainer.style.display = 'none';
    if (this.welcomeMessage) this.welcomeMessage.style.display = 'none';
    if (this.chatArea) this.chatArea.style.display = 'flex';
    if (this.backToMenuBtn) this.backToMenuBtn.style.display = 'flex';
    this.focusInput();
  }

  /* ========== MANEJO DE ESTADOS ========== */

    mostrarCargando() {
    // Limpiar cualquier carga previa
    this.ocultarCargando();

    // Crear nuevo mensaje con ID único
    this.loadingMessageId = 'loading-' + Date.now();
    const mensaje = document.createElement('div');
    mensaje.id = this.loadingMessageId;
    mensaje.className = 'message bot-message loading-message';
    mensaje.innerHTML = `
      <div class="message-content">Buscando información...</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    this.chatBox.appendChild(mensaje);
    this.scrollToBottom();

    // Animación de parpadeo (opcional)
    let visible = true;
    this.loadingInterval = setInterval(() => {
      visible = !visible;
      mensaje.style.opacity = visible ? '1' : '0.5';
    }, 500);
  }

  ocultarCargando() {
    // Detener la animación
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
    
    // Eliminar el mensaje de carga
    if (this.loadingMessageId) {
      this.eliminarMensaje(this.loadingMessageId);
      this.loadingMessageId = null;
    }
  }

  eliminarMensaje(id) {
    const mensaje = document.getElementById(id);
    if (mensaje) {
      mensaje.remove();
    }
  }


  /* ========== EVENT LISTENERS ========== */

  setupEventListeners() {
    // Tarjetas FAQ
    this.faqCards.forEach(card => {
      card.addEventListener('click', () => {
        const pregunta = card.dataset.pregunta;
        if (pregunta) {
          this.mostrarMensaje(pregunta, true);
          this.mostrarAreaChat();
        }
      });
    });

    // Botón de chat directo
    if (this.directChatBtn) {
      this.directChatBtn.addEventListener('click', () => {
        this.mostrarAreaChat();
      });
    }

    // Botón de enviar
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.handleUserInput());
    }

    // Input de texto
    if (this.userInput) {
      this.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserInput();
      });
    }

    // Botón de volver
    if (this.backToMenuBtn) {
      this.backToMenuBtn.addEventListener('click', () => {
        this.mostrarMainMenu();
      });
    }
  }


  validateElements() {
    const requiredElements = {
      chatBox: this.chatBox,
      userInput: this.userInput,
      faqContainer: this.faqContainer,
      chatArea: this.chatArea
    };

    let allValid = true;
    for (const [name, element] of Object.entries(requiredElements)) {
      if (!element) {
        console.error(`Elemento crítico no encontrado: ${name}`);
        allValid = false;
      }
    }
    return allValid;
  }
}

export default ChatbotView;