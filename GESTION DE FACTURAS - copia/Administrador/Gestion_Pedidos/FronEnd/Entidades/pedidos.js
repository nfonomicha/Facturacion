export class Pedido {
  constructor(proveedor, fechaEntrega, estado, total) {
    this.proveedor = proveedor;
    this.fechaRealizacion = new Date();
    this.fechaEntrega = fechaEntrega;
    this.estado = estado;
    this.total = total;
    this.lineasPedidos = [];
  }

  getProveedor() {
    this.proveedor;
  }
  getLineas() {
    return this.lineasPedidos;
  }
  getFechaE() {
    return this.fechaEntrega;
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
  setFechaE(fechaE) {
    this.fechaEntrega = fechaE;
  }
  setLineas(lineas) {
    this.lineasPedidos = lineas;
  }
  setProveedor(proveedor) {
    this.proveedor = proveedor;
  }
}
