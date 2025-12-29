import { Usuarios } from "../Entidades/usuario.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioUsuario");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnCancelar = document.getElementById("btnCancelar");
  const tablaCuerpo = document.getElementById("cuerpoTabla");
  const campoBusqueda = document.getElementById("buscarUsuario");
  const tablaUsuarios = document.getElementById("cuerpoTabla");

  var usuarios = [];
  var usuarioEditando = null;

  asignarEventoAFilas();

  function cargarTabla() {
    tablaUsuarios.innerHTML = "";
    for (let index = 0; index < usuarios.length; index++) {
      const nuevoId = index + 1;
      const nuevaFila = `
            <tr data-id="${nuevoId}">
                <td>${nuevoId}</td>
                <td>${usuarios[index].nombre}</td>
                <td>${usuarios[index].apellidos}</td>
                <td>${usuarios[index].email}</td>
                <td>${usuarios[index].contrasena}</td>
                <td>${usuarios[index].telefono}</td>
                <td>${usuarios[index].rol}</td>
                <td>${usuarios[index].estado}</td>
            </tr>
        `;
      tablaUsuarios.innerHTML += nuevaFila;
    }

    asignarEventoAFilas();
  }

  function asignarEventoAFilas() {
    document.querySelectorAll("#cuerpoTabla tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const nombre = fila.cells[1].textContent;
        const apellidos = fila.cells[2].textContent;
        const email = fila.cells[3].textContent;
        const contrasena = fila.cells[4].textContent;
        const telefono = fila.cells[5].textContent;
        const rol = fila.cells[6].textContent;
        const estado = fila.cells[7].textContent;

        var U = new Usuarios(
          nombre,
          apellidos,
          email,
          telefono,
          contrasena,
          rol,
          estado
        );
        console.log(U);

        btnAgregar.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';

        document.getElementById("nombreUsuario").value = nombre.trim();
        document.getElementById("apellidosUsuario").value = apellidos;
        document.getElementById("emailUsuario").value = email;
        document.getElementById("contrasenaUsuario").value = contrasena;
        document.getElementById("telefonoUsuario").value = telefono;
        document.getElementById("confirmarUcontrasena").value = contrasena;

        const selectRol = document.getElementById("rolUsuario");
        const selectEstado = document.getElementById("estadoUsuario");

        if (selectRol) {
          for (let i = 0; i < selectRol.options.length; i++) {
            if (
              selectRol.options[i].value === U.rol ||
              selectRol.options[i].textContent.trim() === U.rol
            ) {
              selectRol.options[i].selected = true;
              break;
            }
          }
        }

        if (selectEstado) {
          for (let i = 0; i < selectEstado.options.length; i++) {
            if (
              selectEstado.options[i].value.trim() === U.estado.trim() ||
              selectEstado.options[i].textContent.trim() === U.estado.trim()
            ) {
              selectEstado.options[i].selected = true;
              break;
            }
          }
        }

        usuarioEditando = id;
      });
    });
  }

  btnCancelar.addEventListener("click", function () {
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    usuarioEditando = null;
  });

  campoBusqueda.addEventListener("input", function () {
    const textoBusqueda = this.value.toLowerCase();
    const filas = tablaCuerpo.getElementsByTagName("tr");

    for (let fila of filas) {
      const textoFila = fila.textContent.toLowerCase();
      if (textoFila.includes(textoBusqueda)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    }
  });

  btnAgregar.addEventListener("click", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreUsuario").value;
    const apellidos = document.getElementById("apellidosUsuario").value;
    const email = document.getElementById("emailUsuario").value;
    const telefono = document.getElementById("telefonoUsuario").value;
    const contrasena = document.getElementById("contrasenaUsuario").value;
    const confirmacionContrasena = document.getElementById(
      "confirmarUcontrasena"
    ).value;

    const selectRol = document.getElementById("rolUsuario");
    const selectEstado = document.getElementById("estadoUsuario");
    const rol = selectRol ? selectRol.value : "";
    const estado = selectEstado ? selectEstado.value : "";

    if (
      nombre === "" ||
      apellidos === "" ||
      email === "" ||
      telefono === "" ||
      contrasena === "" ||
      confirmacionContrasena === "" ||
      rol === "" ||
      estado === ""
    ) {
      alert("Por favor, rellene todos los campos");
      return;
    }

    if (contrasena !== confirmacionContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (usuarioEditando) {
      const index = parseInt(usuarioEditando) - 1;
      if (index >= 0 && index < usuarios.length) {
        let usuarioExistente = Verificar(
          nombre,
          apellidos,
          email,
          telefono,
          contrasena,
          rol,
          estado
        );
        if (usuarioExistente && usuarioExistente !== usuarios[index]) {
          alert("Ya existe un usuario con esos datos");
          return;
        }

        usuarios[index].setNombre(nombre);
        usuarios[index].setApellidos(apellidos);
        usuarios[index].setEmail(email);
        usuarios[index].setTelefono(telefono);
        usuarios[index].setContrasena(contrasena);
        usuarios[index].setRol(rol);
        usuarios[index].setEstado(estado);
        cargarTabla();
        alert("Usuario actualizado exitosamente");
      }
    } else {
      let usuarioExistente = Verificar(
        nombre,
        apellidos,
        email,
        telefono,
        contrasena,
        rol,
        estado
      );
      if (usuarioExistente) {
        alert("Ya existe un usuario con esos datos");
        return;
      }

      const miUsuario = new Usuarios(
        nombre,
        apellidos,
        email,
        telefono,
        contrasena,
        rol,
        estado
      );
      usuarios.push(miUsuario);
      alert("Usuario agregado exitosamente");
    }

    cargarTabla();
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    usuarioEditando = null;
  });

  function Verificar(n, a, e, t, c, r, es) {
    for (let index = 0; index < usuarios.length; index++) {
      if (
        usuarios[index].nombre.trim().toLowerCase() ===
          n.trim().toLowerCase() &&
        usuarios[index].apellidos.trim().toLowerCase() ===
          a.trim().toLowerCase() &&
        usuarios[index].email.trim().toLowerCase() === e.trim().toLowerCase() &&
        usuarios[index].telefono.trim().toLowerCase() ===
          t.trim().toLowerCase() &&
        usuarios[index].contrasena.trim().toLowerCase() ===
          c.trim().toLowerCase() &&
        usuarios[index].rol.trim().toLowerCase() === r.trim().toLowerCase() &&
        usuarios[index].estado.trim().toLowerCase() === es.trim().toLowerCase()
      ) {
        return usuarios[index];
      }
    }
    return false;
  }

  function cargarUsuariosDesdeTabla() {
    usuarios = [];
    const filas = document.querySelectorAll("#cuerpoTabla tr");

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length >= 8) {
        const id = parseInt(celdas[0].textContent);
        const nombreU = celdas[1].textContent.trim();
        const apellidosU = celdas[2].textContent.trim();
        const emailU = celdas[3].textContent.trim();
        const telefonoU = celdas[5].textContent.trim();
        const contrasenaU = celdas[4].textContent.trim();
        const rolU = celdas[6].textContent.trim();
        const estadoU = celdas[7].textContent.trim();

        let user = new Usuarios(
          nombreU,
          apellidosU,
          emailU,
          telefonoU,
          contrasenaU,
          rolU,
          estadoU
        );
        usuarios.push(user);
      }
    });
    console.log("Usuarios cargados:", usuarios);
    return usuarios;
  }

  btnEliminar.addEventListener("click", function (e) {
    e.preventDefault();

    if (usuarioEditando === null) {
      alert("Por favor, seleccione un usuario para eliminarlo");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar este usuario?"
    );
    if (!confirmar) {
      return;
    }

    const index = usuarioEditando - 1;

    if (index >= 0 && index < usuarios.length) {
      usuarios.splice(index, 1);
      cargarTabla();
      formulario.reset();
      btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
      usuarioEditando = null;
      alert("Usuario eliminado exitosamente");
    } else {
      alert("Error: No se pudo encontrar el usuario a eliminar");
    }
  });

  cargarUsuariosDesdeTabla();
});
