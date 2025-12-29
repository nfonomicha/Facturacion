import { Proveedor } from "../Entidades/proveedores.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioProveedor");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnCancelar = document.getElementById("btnCancelar");
  const tablaCuerpo = document.getElementById("cuerpoTabla");
  const campoBusqueda = document.getElementById("buscarProveedor");
  const tablaProveedores = document.getElementById("cuerpoTabla");

  var proveedores = [];
  var proveedorEditando = null;

  asignarEventoAFilas();

  function cargarTabla() {
    tablaProveedores.innerHTML = "";
    for (let index = 0; index < proveedores.length; index++) {
      const nuevoId = index + 1;
      const nuevaFila = `
            <tr data-id="${nuevoId}">
                <td>${nuevoId}</td>
                <td>${proveedores[index].nombre}</td>
                <td>${proveedores[index].categoria}</td>
                <td>${proveedores[index].telefono}</td>
                <td>${proveedores[index].direccion}</td>
                <td>${proveedores[index].estado}</td>
            </tr>
        `;
      tablaProveedores.innerHTML += nuevaFila;
    }

    asignarEventoAFilas();
  }

  function asignarEventoAFilas() {
    document.querySelectorAll("#cuerpoTabla tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const nombre = fila.cells[1].textContent;
        const categoria = fila.cells[2].textContent;
        const telefono = fila.cells[3].textContent;
        const direccion = fila.cells[4].textContent;
        const estado = fila.cells[5].textContent;

        var P = new Proveedor(nombre, telefono, estado, categoria, direccion);
        console.log(P);

        btnAgregar.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';

        document.getElementById("empresaProveedor").value = nombre.trim();
        document.getElementById("categoriaProveedor").value = categoria;
        document.getElementById("telefonoProveedor").value = telefono;
        document.getElementById("direccionProveedor").value = direccion;

        const selectEstado = document.getElementById("estadoProveedor");

        if (selectEstado) {
          for (let i = 0; i < selectEstado.options.length; i++) {
            if (
              selectEstado.options[i].value === P.estado ||
              selectEstado.options[i].textContent.trim() === P.estado
            ) {
              selectEstado.options[i].selected = true;
              break;
            }
          }
        }

        proveedorEditando = id;
      });
    });
  }

  btnCancelar.addEventListener("click", function () {
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    proveedorEditando = null;
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

    const nombre = document.getElementById("empresaProveedor").value;
    const categoria = document.getElementById("categoriaProveedor").value;
    const telefono = document.getElementById("telefonoProveedor").value;
    const direccion = document.getElementById("direccionProveedor").value;

    const selectEstado = document.getElementById("estadoProveedor");
    const estado = selectEstado ? selectEstado.value : "";

    if (
      nombre === "" ||
      categoria === "" ||
      telefono === "" ||
      direccion === "" ||
      estado === ""
    ) {
      alert("Por favor, rellene todos los campos");
      return;
    }

    if (proveedorEditando) {
      const index = parseInt(proveedorEditando) - 1;
      if (index >= 0 && index < proveedores.length) {
        let proveedorExistente = Verificar(
          nombre,
          telefono,
          estado,
          categoria,
          direccion
        );
        if (proveedorExistente && proveedorExistente !== proveedores[index]) {
          alert("Ya existe un proveedor con esos datos");
          return;
        }

        proveedores[index].setNombre(nombre);
        proveedores[index].setCategoria(categoria);
        proveedores[index].setTelefono(telefono);
        proveedores[index].setDireccion(direccion);
        proveedores[index].setEstado(estado);
        cargarTabla();
        alert("Proveedor actualizado exitosamente");
      }
    } else {
      let proveedorExistente = Verificar(
        nombre,
        telefono,
        estado,
        categoria,
        direccion
      );
      if (proveedorExistente) {
        alert("Ya existe un proveedor con esos datos");
        return;
      }

      const miProveedor = new Proveedor(
        nombre,
        telefono,
        estado,
        categoria,
        direccion
      );
      proveedores.push(miProveedor);
      alert("Proveedor agregado exitosamente");
    }

    cargarTabla();
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    proveedorEditando = null;
  });

  function Verificar(n, t, e, c, d) {
    for (let index = 0; index < proveedores.length; index++) {
      if (
        proveedores[index].nombre.trim().toLowerCase() ===
          n.trim().toLowerCase() &&
        proveedores[index].telefono.trim().toLowerCase() ===
          t.trim().toLowerCase() &&
        proveedores[index].estado.trim().toLowerCase() ===
          e.trim().toLowerCase() &&
        proveedores[index].categoria.trim().toLowerCase() ===
          c.trim().toLowerCase() &&
        proveedores[index].direccion.trim().toLowerCase() ===
          d.trim().toLowerCase()
      ) {
        return proveedores[index];
      }
    }
    return false;
  }

  function cargarProveedoresDesdeTabla() {
    proveedores = [];
    const filas = document.querySelectorAll("#cuerpoTabla tr");

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length >= 6) {
        const id = parseInt(celdas[0].textContent);
        const nombreP = celdas[1].textContent.trim();
        const categoriaP = celdas[2].textContent.trim();
        const telefonoP = celdas[3].textContent.trim();
        const direccionP = celdas[4].textContent.trim();
        const estadoP = celdas[5].textContent.trim();

        let proveedor = new Proveedor(
          nombreP,
          telefonoP,
          estadoP,
          categoriaP,
          direccionP
        );
        proveedores.push(proveedor);
      }
    });
    console.log("Proveedores cargados:", proveedores);
    return proveedores;
  }

  btnEliminar.addEventListener("click", function (e) {
    e.preventDefault();

    if (proveedorEditando === null) {
      alert("Por favor, seleccione un proveedor para eliminarlo");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar este proveedor?"
    );
    if (!confirmar) {
      return;
    }

    const index = proveedorEditando - 1;

    if (index >= 0 && index < proveedores.length) {
      proveedores.splice(index, 1);
      cargarTabla();
      formulario.reset();
      btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
      proveedorEditando = null;
      alert("Proveedor eliminado exitosamente");
    } else {
      alert("Error: No se pudo encontrar el proveedor a eliminar");
    }
  });

  cargarProveedoresDesdeTabla();
});
