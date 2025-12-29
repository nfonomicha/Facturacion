import { Producto } from "../Entidades/producto.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioProducto");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnCancelar = document.getElementById("btnCancelar");
  const tablaCuerpo = document.getElementById("cuerpoTabla");
  const campoBusqueda = document.getElementById("buscarProducto");
  const tablaProductos = document.getElementById("cuerpoTabla");

  var productos = [];
  var productoEditando = null;

  asignarEventoAFilas();

  function cargarTabla() {
    tablaProductos.innerHTML = "";
    for (let index = 0; index < productos.length; index++) {
      const nuevoId = index + 1;
      const nuevaFila = `
            <tr data-id="${nuevoId}">
                <td>${nuevoId}</td>
                <td>${productos[index].nombre}</td>
                <td>${productos[index].cantidad}</td>
                <td>${productos[index].precio}</td>
                <td>${productos[index].categoria}</td>
                <td>${productos[index].estado}</td>
            </tr>
        `;
      tablaProductos.innerHTML += nuevaFila;
    }
    asignarEventoAFilas();
  }

  function asignarEventoAFilas() {
    document.querySelectorAll("#cuerpoTabla tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const nombre = fila.cells[1].textContent;
        const cantidad = fila.cells[2].textContent;
        const precio = fila.cells[3].textContent;
        const categoria = fila.cells[4].textContent;
        const estado = fila.cells[5].textContent;

        var P = new Producto(nombre, categoria, cantidad, precio, estado);
        console.log(P);

        btnAgregar.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';

        document.getElementById("nombreProducto").value = nombre.trim();
        document.getElementById("cantidadProducto").value = cantidad;
        document.getElementById("precioProducto").value = parseInt(precio);
        const selectCategoria = document.getElementById("categoriaProducto");
        const selectEstado = document.getElementById("estadoProducto");

        if (selectCategoria) {
          for (let i = 0; i < selectCategoria.options.length; i++) {
            if (
              selectCategoria.options[i].value === P.categoria ||
              selectCategoria.options[i].textContent.trim() === P.categoria
            ) {
              selectCategoria.options[i].selected = true;
              break;
            }
          }
        }

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

        productoEditando = id;
      });
    });
  }

  btnCancelar.addEventListener("click", function () {
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    productoEditando = null;
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

    const nombre = document.getElementById("nombreProducto").value;
    const cantidad = document.getElementById("cantidadProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const selectCategoria = document.getElementById("categoriaProducto");
    const selectEstado = document.getElementById("estadoProducto");
    const categoria = selectCategoria ? selectCategoria.value : "";
    const estado = selectEstado ? selectEstado.value : "";

    if (
      nombre === "" ||
      cantidad === "" ||
      precio === "" ||
      categoria === "" ||
      estado === ""
    ) {
      alert("Por favor, rellene todos los campos");
      return;
    }

    if (cantidad < 0 || precio < 0) {
      alert("La cantidad y el precio deben ser valores positivos");
      return;
    }

    if (productoEditando) {
      const index = parseInt(productoEditando) - 1;
      if (index >= 0 && index < productos.length) {
        let productoExistente = Verificar(
          nombre,
          categoria,
          cantidad,
          precio,
          estado
        );
        if (productoExistente && productoExistente !== productos[index]) {
          alert("Ya existe un producto con esos datos");
          return;
        }

        productos[index].setNombre(nombre);
        productos[index].setCategoria(categoria);
        productos[index].setCantidad(cantidad);
        productos[index].setPrecio(precio);
        productos[index].setEstado(estado);
        cargarTabla();
        alert("Producto actualizado exitosamente");
      }
    } else {
      let productoExistente = Verificar(
        nombre,
        categoria,
        cantidad,
        precio,
        estado
      );
      if (productoExistente) {
        alert("Ya existe un producto con esos datos");
        return;
      }

      const miProducto = new Producto(
        nombre,
        categoria,
        cantidad,
        precio,
        estado
      );
      productos.push(miProducto);
      alert("Producto agregado exitosamente");
    }

    cargarTabla();
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    productoEditando = null;
  });

  function Verificar(n, c, cant, p, e) {
    for (let index = 0; index < productos.length; index++) {
      if (
        productos[index].nombre.trim().toLowerCase() ===
          n.trim().toLowerCase() &&
        productos[index].categoria.trim().toLowerCase() ===
          c.trim().toLowerCase() &&
        productos[index].cantidad.toString() === cant.toString() &&
        productos[index].precio.toString() === p.toString() &&
        productos[index].estado.trim().toLowerCase() === e.trim().toLowerCase()
      ) {
        return productos[index];
      }
    }
    return false;
  }

  function cargarProductosDesdeTabla() {
    productos = [];
    const filas = document.querySelectorAll("#cuerpoTabla tr");

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length >= 6) {
        const id = parseInt(celdas[0].textContent);
        const nombreP = celdas[1].textContent.trim();
        const cantidadP = celdas[2].textContent.trim();
        const precioP = celdas[3].textContent.trim();
        const categoriaP = celdas[4].textContent.trim();
        const estadoP = celdas[5].textContent.trim();

        let producto = new Producto(
          nombreP,
          categoriaP,
          cantidadP,
          precioP,
          estadoP
        );
        productos.push(producto);
      }
    });
    console.log("Productos cargados:", productos);
    return productos;
  }

  btnEliminar.addEventListener("click", function (e) {
    e.preventDefault();

    if (productoEditando === null) {
      alert("Por favor, seleccione un producto para eliminarlo");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar este producto?"
    );
    if (!confirmar) {
      return;
    }

    const index = productoEditando - 1;

    if (index >= 0 && index < productos.length) {
      productos.splice(index, 1);
      cargarTabla();
      formulario.reset();
      btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
      productoEditando = null;
      alert("Producto eliminado exitosamente");
    } else {
      alert("Error: No se pudo encontrar el producto a eliminar");
    }
  });

  cargarProductosDesdeTabla();
});
