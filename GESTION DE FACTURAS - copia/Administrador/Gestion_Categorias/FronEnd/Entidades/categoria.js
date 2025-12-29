export class Categoria {
  constructor(nombre, descriocion) {
    this.nombre = nombre;
    this.descriocion = descriocion;
  }

  getNombre() {
    return this.nombre;
  }
  getDescripcion() {
    return this.descriocion;
  }
  setNombre(nombre) {
    this.nombre = nombre;
  }
  setDescripcion(descriocion) {
    this.descriocion = descriocion;
  }
  toString() {
    return this.nombre + " : " + this.descriocion;
  }
}
