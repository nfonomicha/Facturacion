export class Factura {
  constructor(formaPago, fechaVencimiento, estado, total) {
    this.fechaRealizacion = new Date();
    this.fechaVencimiento = fechaVencimiento;
    this.formaPago = formaPago;
    this.estado = estado;
    this.total = total;
    this.lineasFacturas = [];
  }

  getFormaPago() {
    this.formaPago;
  }
  getLineas() {
    return this.lineasPedidos;
  }
  getFechaV() {
    return this.fechaVencimiento;
  }
  getFechaR() {
    return this.fechaRealizacion;
  }
  getEstado() {
    return this.estado;
  }
  getTotal() {
    return this.total;
  }

  setTotal(total) {
    this.total = total;
  }
  setEstado(estado) {
    this.estado = estado;
  }
  setFechaR(fechaR) {
    this.fechaRealizacion = fechaR;
  }
  setFechaV(fechaV) {
    this.fechaVencimiento = fechaV;
  }
  setLineas(lineas) {
    this.lineasPedidos = lineas;
  }
  setFormaPago(formaPago) {
    this.formaPago = formaPago;
  }
}
