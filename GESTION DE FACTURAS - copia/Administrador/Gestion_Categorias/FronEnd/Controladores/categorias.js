import { Categoria } from "/Administrador/Gestion_Categorias/FronEnd/Entidades/categoria.js";

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formularioCategoria");
  const btnAgregar = document.getElementById("btnAgregar");
  const btnEliminar = document.getElementById("btnEliminar");
  const btnCancelar = document.getElementById("btnCancelar");
  const tablaCuerpo = document.getElementById("cuerpoTabla");
  const campoBusqueda = document.getElementById("buscarCategoria");
  const tablaCategorias = document.getElementById("cuerpoTabla");
  asignarEventListenersFilas();
  var categorias = [];
  let categoriaEditando = null;
  function cargarTabla() {
    tablaCategorias.innerHTML = "";
    for (let index = 0; index < categorias.length; index++) {
      const nuevoId = index + 1;
      const nuevaFila = `
            <tr data-id="${nuevoId}">
                <td>${nuevoId}</td>
                <td>${categorias[index].nombre}</td>
                <td>${categorias[index].getDescripcion()}</td>
            </tr>
        `;
      tablaCategorias.innerHTML += nuevaFila;
    }

    asignarEventListenersFilas();
  }

  function asignarEventListenersFilas() {
    document.querySelectorAll("#cuerpoTabla tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const nombre = fila.cells[1].textContent;
        const descripcion = fila.cells[2].textContent;

        btnAgregar.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';

        document.getElementById("nombreCategoria").value = nombre;
        document.getElementById("descripcionCategoria").value = descripcion;

        categoriaEditando = id;
      });
    });
  }

  btnCancelar.addEventListener("click", function () {
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar'; // Restaurar texto del botón
    categoriaEditando = null;
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

    const nombre = document.getElementById("nombreCategoria").value;
    const descripcion = document.getElementById("descripcionCategoria").value;

    if (!nombre.trim()) {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (categoriaEditando) {
      const index = parseInt(categoriaEditando) - 1;
      if (index >= 0 && index < categorias.length) {
        let categoriaExistente = Verificar(nombre.trim());
        if (categoriaExistente && categorias[index].nombre !== nombre.trim()) {
          alert("Ya existe una categoría con ese nombre");
          return;
        }

        categorias[index].nombre = nombre;
        categorias[index].setDescripcion(descripcion);
        cargarTabla();
        alert("Categoría actualizada exitosamente");
      }
    } else {
      let categoriaExistente = Verificar(nombre.trim());
      if (categoriaExistente) {
        alert("Ya existe una categoría con ese nombre");
        return;
      }
      const micategoria = new Categoria(nombre, descripcion);
      let x= confirm(`Quiere agregar la categoria ${micategoria.nombre} `)
      if(x){
         categorias.push(micategoria);
      alert("Categoría agregada exitosamente");
      }
      
    }

    cargarTabla();
    formulario.reset();
    btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
    categoriaEditando = null;
  });

  function Verificar(n) {
    for (let index = 0; index < categorias.length; index++) {
      if (categorias[index].nombre.trim().toLowerCase() === n.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  function cargarCategoriasDesdeTabla() {
    categorias = [];
    const filas = document.querySelectorAll("#cuerpoTabla tr");

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length >= 3) {
        const id = parseInt(celdas[0].textContent);
        const nombreC = celdas[1].textContent;
        const descripcionC = celdas[2].textContent;
        let cat = new Categoria(nombreC, descripcionC);
        categorias.push(cat);
      }
    });
    console.log("Categorías cargadas:", categorias);
    return categorias;
  }

  btnEliminar.addEventListener("click", function (e) {
    e.preventDefault();

    if (categoriaEditando === null) {
      alert("Por favor, seleccione una categoría para eliminar");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar esta categoría?"
    );
    if (!confirmar) {
      return;
    }

    const index = categoriaEditando - 1;

    if (index >= 0 && index < categorias.length) {
      categorias.splice(index, 1);

      cargarTabla();

      formulario.reset();
      btnAgregar.innerHTML = '<i class="fas fa-plus me-1"></i> Agregar';
      categoriaEditando = null;

      alert("Categoría eliminada exitosamente");
    } else {
      alert("Error: No se pudo encontrar la categoría a eliminar");
    }
  });
  cargarCategoriasDesdeTabla();
});
