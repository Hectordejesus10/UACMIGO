import { SessionFactory } from './Sesion.js';
import Consulta from './Consulta.js';
import ProxyChatbot from './ProxyChatbot.js';  

class Chatbot {
    static instance = null;
    
    constructor() {
      if (Chatbot.instance) {
        return Chatbot.instance;
      }
      
      this.nombre = "Asistente UACM";
      this.version = "1.0";
      this.estado = "inactivo";
      this.sesionActual = null;
      
      Chatbot.instance = this;
    }
    
    static getInstance() {
      if (!Chatbot.instance) {
        Chatbot.instance = new Chatbot();
      }
      return Chatbot.instance;
    }
    
    crearSession() {
      const sessionFactory = new SessionFactory();
      this.sesionActual = sessionFactory.crearSession();
      this.estado = "activo";
      return this.sesionActual;
    }
    
    processarConsulta(texto) {
      if (!this.sesionActual) {
        this.crearSession();
      }
      
      const consulta = new Consulta(texto);
      this.sesionActual.consultas.push(consulta);
      
      const proxy = new ProxyChatbot(this);
      return proxy.processarConsulta(texto);
    }
    
    obtenerSoporte() {
      return SoporteTecnico.obtenerContactos();
    }
  }
  
  export default Chatbot;
