export class LineaPedido {
  constructor(producto, cantidad, precio) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precio = precio;
    this.subTotal = precio * cantidad;
  }

  getProducto() {
    return this.producto;
  }
  getPrecio() {
    return this.precio;
  }
  getCantidad() {
    return this.cantidad;
  }
  getSubTotal() {
    return this.subTotal;
  }

  setProducto(producto) {
    this.producto = producto;
  }
  setPrecio(precio) {
    this.precio = precio;
  }
  setCantidad(cantidad) {
    this.cantidad = cantidad;
  }
}
