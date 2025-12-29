export class Proveedor {
  constructor(nombre, telefono, estado, direccion) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.estado = estado;
    this.direccion = direccion;
  }

  getNombre() {
    return this.nombre;
  }
  getTelefono() {
    return this.telefono;
  }
  getEstado() {
    return this.estado;
  }
  getDireccion() {
    return this.direccion;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }
  setEstado(estado) {
    this.estado = estado;
  }
  setTelefono(telefono) {
    this.telefono = telefono;
  }
  setDireccion(direccion) {
    this.direccion = direccion;
  }
}
