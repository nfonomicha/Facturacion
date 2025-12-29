export class Usuarios {
  constructor(nombre, apellidos, email, telefono, contrasena, rol, estado) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.email = email;
    this.telefono = telefono;
    this.contrasena = contrasena;
    this.rol = rol;
    this.estado = estado;
  }

  getNombre() {
    return this.nombre;
  }
  getApellidos() {
    return this.apellidos;
  }
  getEmail() {
    return this.email;
  }
  getTelefono() {
    return this.telefono;
  }
  getTelefono() {
    return this.contrasena;
  }
  getRol() {
    return this.rol;
  }
  getEstado() {
    return this.estado;
  }
  setNombre(nombre) {
    this.nombre = nombre;
  }
  setApellidos(apellidos) {
    this.apellidos = apellidos;
  }
  setTelefono(telefono) {
    this.telefono = telefono;
  }
  setEmail(email) {
    this.email = email;
  }
  setContrasena(contrasena) {
    this.contrasena = contrasena;
  }
  setRol(rol) {
    this.rol = rol;
  }
  setEstado(estado) {
    this.estado = estado;
  }
}
