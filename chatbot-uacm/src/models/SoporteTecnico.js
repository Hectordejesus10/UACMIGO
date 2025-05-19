class SoporteTecnico {
    constructor() {
      this.id = "ST001";
      this.tipo = "Email";
      this.contacto = "soporte@uacm.edu.mx";
      this.ubicacion = "Remoto";
    }
    
    static obtenerContactos() {
      return ["soporte@uacm.edu.mx", "Tel: 55 1234 5678"];
    }
    
    static obtenerUbicaciones() {
      return ["Edificio Principal", "Planta Baja"];
    }
  }
  
  export default SoporteTecnico;
