class Consulta {
  constructor(textoConsulta) {
    this.id = 'consulta-' + Math.random().toString(36).substr(2, 9);
    this.textoConsulta = textoConsulta;
    this.respuesta = null;
    this.fechahora = new Date();
  }
  
  generarRespuesta() {
    return this.respuesta || "En proceso...";
  }
}


export default Consulta;