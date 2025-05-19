class SessionFactory {
    crearSession() {
      const id = 'sesion-' + Math.random().toString(36).substr(2, 9);
      return new Sesion(id);
    }
  }
  
  class Sesion {
    constructor(id) {
      this.idSession = id;
      this.estado = "Activa";
      this.consultas = [];
    }
    
    iniciarSession() {
      this.estado = "Activa";
    }
    
    cerrarSession() {
      this.estado = "Cerrada";
    }
    
    obtenerDatosSession() {
      return {
        id: this.idSession,
        estado: this.estado,
        consultas: this.consultas.length
      };
    }
  }
  
  export { SessionFactory, Sesion };
