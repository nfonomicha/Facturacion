export class Producto {
  constructor(nombre, categoria, cantidad, precio, estado) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.cantidad = cantidad;
    this.precio = precio;
    this.estado = estado;
  }
  getNombre() {
    return this.nombre;
  }
  getCategoria() {
    return this.categoria;
  }
  getCantidad() {
    return this.cantidad;
  }
  getPrecio() {
    return this.precio;
  }
  getEstado() {
    return this.estado;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }
  setCategoria(categoria) {
    this.categoria = categoria;
  }
  setCantidad(cantidad) {
    this.cantidad = cantidad;
  }
  setPrecio(precio) {
    this.precio = precio;
  }
  setEstado(estado) {
    this.estado = estado;
  }
}
