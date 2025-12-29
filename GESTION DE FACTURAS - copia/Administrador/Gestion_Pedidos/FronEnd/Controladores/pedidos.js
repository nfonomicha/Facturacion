import { Pedido } from "../Entidades/pedidos.js";
import { LineaPedido } from "../Entidades/lineaPedidos.js";

document.addEventListener("DOMContentLoaded", function () {
  const formularioPedido = document.getElementById("formularioPedido");
  const formularioLineaPedido = document.getElementById(
    "formularioLineaPedido"
  );
  const btnCrearPedido = document.getElementById("btnCrearPedido");
  const btnEliminarPedido = document.getElementById("btnEliminarPedido");
  const btnCancelarPedido = document.getElementById("btnCancelarPedido");
  const btnImprimirPedido = document.getElementById("btnImprimirPedido");
  const btnAgregarLinea = document.getElementById("btnAgregarLinea");
  const btnEliminarLinea = document.getElementById("btnEliminarLinea");
  const btnLimpiarLineas = document.getElementById("btnLimpiarLineas");
  const tablaPedidos = document.getElementById("cuerpoTablaPedidos");
  const tablaLineas = document.getElementById("cuerpoTablaLineas");
  const campoBusquedaPedidos = document.getElementById("buscarPedido");
  const campoBusquedaLineas = document.getElementById("buscarLineas");
  const proveedorPedido = document.getElementById("proveedorPedido");
  const fechaEntrega = document.getElementById("fechaEntrega");
  const estadoPedido = document.getElementById("estadoPedido");
  const productoPedido = document.getElementById("productoPedido");
  const cantidadPedido = document.getElementById("cantidadPedido");
  const precioPedido = document.getElementById("precioPedido");
  const subtotalLinea = document.getElementById("subtotalLinea");

  var pedidos = [];
  var lineasPedidoActual = [];
  var pedidoEditando = null;
  var lineaEditando = null;

  const fechaActual = new Date().toISOString().split("T")[0];
  document.getElementById("fecha-actual").textContent =
    new Date().toLocaleDateString("es-ES");
  cantidadPedido.addEventListener("input", calcularSubtotal);
  precioPedido.addEventListener("input", calcularSubtotal);

  function calcularSubtotal() {
    const cantidad = parseInt(cantidadPedido.value) || 0;
    const precio = parseInt(precioPedido.value) || 0;
    const subtotal = cantidad * precio;
    subtotalLinea.value = subtotal.toLocaleString() + " FCFA";
  }
  asignarEventoAFilasPedidos();

  function asignarEventoAFilasPedidos() {
    document.querySelectorAll("#cuerpoTablaPedidos tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const proveedor = fila.cells[1].textContent.trim();
        const fechaPedido = fila.cells[2].textContent;
        const fechaEntregaValue = fila.cells[3].textContent;
        const total = parseInt(
          fila.cells[4].textContent.replace(/[^0-9]/g, "")
        );
        const estado = fila.cells[5].textContent;
        proveedorPedido.value = obtenerValorProveedor(proveedor);
        const [day, month, year] = fechaEntregaValue.split("/");
        fechaEntrega.value = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;

        estadoPedido.value = estado;

        btnCrearPedido.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';
        pedidoEditando = id;
        cargarLineasPedido(id);
      });
    });
  }

  function obtenerValorProveedor(nombreProveedor) {
    const opciones = proveedorPedido.options;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].textContent.includes(nombreProveedor)) {
        return opciones[i].value;
      }
    }
    return "";
  }

  function cargarLineasPedido(idPedido) {
    const pedidoIndex = parseInt(idPedido) - 1;
    if (pedidoIndex >= 0 && pedidoIndex < pedidos.length) {
      const pedido = pedidos[pedidoIndex];
      lineasPedidoActual = [...pedido.lineasPedidos];
      actualizarTablaLineas();
      calcularTotalPedido();
    } else {
      lineasPedidoActual = [];
      tablaLineas.innerHTML = "";
    }
  }

  function agregarLineaATabla(producto, cantidad, precio) {
    const subtotal = cantidad * precio;
    const nuevaLinea = new LineaPedido(producto, cantidad, precio);
    lineasPedidoActual.push(nuevaLinea);

    const nuevaFila = `
      <tr data-id="${lineasPedidoActual.length}">
        <td>${lineasPedidoActual.length}</td>
        <td>${producto}</td>
        <td>${cantidad}</td>
        <td>${precio.toLocaleString()}</td>
        <td>${subtotal.toLocaleString()} FCFA</td>
      </tr>
    `;
    tablaLineas.innerHTML += nuevaFila;
  }

  function asignarEventoAFilasLineas() {
    document.querySelectorAll("#cuerpoTablaLineas tr").forEach((linea) => {
      linea.addEventListener("click", function () {
        const fila = this.closest("tr");
        const id = fila.cells[0].textContent;
        const producto = fila.cells[1].textContent.trim();
        const cantidad = fila.cells[2].textContent;
        const precio = parseInt(
          fila.cells[3].textContent.replace(/[^0-9]/g, "")
        );
        productoPedido.value = producto;
        cantidadPedido.value = cantidad;
        precioPedido.value = precio;
        calcularSubtotal();

        btnAgregarLinea.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';
        lineaEditando = id;
      });
    });
  }

  btnCancelarPedido.addEventListener("click", function () {
    formularioPedido.reset();
    formularioLineaPedido.reset();
    btnCrearPedido.innerHTML = '<i class="fas fa-save me-1"></i> Guardar';
    subtotalLinea.value = "0 FCFA";
    pedidoEditando = null;
    lineaEditando = null;
    lineasPedidoActual = [];
    tablaLineas.innerHTML = "";
  });

  btnLimpiarLineas.addEventListener("click", function () {
    formularioLineaPedido.reset();
    btnAgregarLinea.innerHTML =
      '<i class="fas fa-plus me-1"></i> Agregar Línea';
    subtotalLinea.value = "0 FCFA";
    lineaEditando = null;
  });

  campoBusquedaPedidos.addEventListener("input", function () {
    buscarEnTabla(this.value.toLowerCase(), tablaPedidos);
  });

  campoBusquedaLineas.addEventListener("input", function () {
    buscarEnTabla(this.value.toLowerCase(), tablaLineas);
  });

  function buscarEnTabla(texto, tabla) {
    const filas = tabla.getElementsByTagName("tr");
    for (let fila of filas) {
      const textoFila = fila.textContent.toLowerCase();
      if (textoFila.includes(texto)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    }
  }

  btnAgregarLinea.addEventListener("click", function (e) {
    e.preventDefault();

    const producto = productoPedido.value;
    const cantidad = parseInt(cantidadPedido.value);
    const precio = parseInt(precioPedido.value);

    if (!producto || !cantidad || !precio || cantidad <= 0 || precio <= 0) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    if (lineaEditando) {
      const index = parseInt(lineaEditando) - 1;
      if (index >= 0 && index < lineasPedidoActual.length) {
        lineasPedidoActual[index].setProducto(producto);
        lineasPedidoActual[index].setCantidad(cantidad);
        lineasPedidoActual[index].setPrecio(precio);
        lineasPedidoActual[index].subTotal = cantidad * precio;

        actualizarTablaLineas();
        alert("Línea actualizada exitosamente");
      }
    } else {
      const nuevaLinea = new LineaPedido(producto, cantidad, precio);
      lineasPedidoActual.push(nuevaLinea);
      actualizarTablaLineas();
      alert("Línea agregada exitosamente");
    }

    formularioLineaPedido.reset();
    btnAgregarLinea.innerHTML =
      '<i class="fas fa-plus me-1"></i> Agregar Línea';
    subtotalLinea.value = "0 FCFA";
    lineaEditando = null;
    calcularTotalPedido();
  });

  function actualizarTablaLineas() {
    tablaLineas.innerHTML = "";
    lineasPedidoActual.forEach((linea, index) => {
      const nuevaFila = `
        <tr data-id="${index + 1}">
          <td>${index + 1}</td>
          <td>${linea.producto}</td>
          <td>${linea.cantidad}</td>
          <td>${linea.precio.toLocaleString()}</td>
          <td>${linea.subTotal.toLocaleString()} FCFA</td>
        </tr>
      `;
      tablaLineas.innerHTML += nuevaFila;
    });
    asignarEventoAFilasLineas();
  }

  function calcularTotalPedido() {
    let total = 0;
    lineasPedidoActual.forEach((linea) => {
      total += linea.subTotal;
    });
    return total;
  }

  btnCrearPedido.addEventListener("click", function (e) {
    e.preventDefault();

    const proveedor = proveedorPedido.value;
    const fechaEntregaValue = fechaEntrega.value;
    const estado = estadoPedido.value;
    const total = calcularTotalPedido();

    if (!proveedor || !fechaEntregaValue || !estado) {
      alert("Por favor, complete todos los campos del pedido");
      return;
    }

    if (lineasPedidoActual.length === 0) {
      alert("Debe agregar al menos una línea al pedido");
      return;
    }

    if (pedidoEditando) {
      const index = parseInt(pedidoEditando) - 1;
      if (index >= 0 && index < pedidos.length) {
        pedidos[index].setProveedor(proveedor);
        pedidos[index].setFechaE(fechaEntregaValue);
        pedidos[index].setEstado(estado);
        pedidos[index].setTotal(total);
        pedidos[index].setLineas([...lineasPedidoActual]);

        cargarTablaPedidos();
        alert("Pedido actualizado exitosamente");
      }
    } else {
      const nuevoPedido = new Pedido(
        proveedor,
        fechaEntregaValue,
        estado,
        total
      );
      nuevoPedido.setLineas([...lineasPedidoActual]);
      pedidos.push(nuevoPedido);
      cargarTablaPedidos();
      alert("Pedido creado exitosamente");
    }

    formularioPedido.reset();
    formularioLineaPedido.reset();
    btnCrearPedido.innerHTML = '<i class="fas fa-save me-1"></i> Guardar';
    subtotalLinea.value = "0 FCFA";
    pedidoEditando = null;
    lineaEditando = null;
    lineasPedidoActual = [];
    tablaLineas.innerHTML = "";
  });

  function cargarTablaPedidos() {
    tablaPedidos.innerHTML = "";
    pedidos.forEach((pedido, index) => {
      const fechaPedido = new Date(pedido.fechaRealizacion).toLocaleDateString(
        "es-ES"
      );
      const fechaEntregaFormateada = new Date(
        pedido.fechaEntrega
      ).toLocaleDateString("es-ES");

      const nuevaFila = `
        <tr data-id="${index + 1}">
          <td>${index + 1}</td>
          <td><strong>${obtenerNombreProveedor(pedido.proveedor)}</strong></td>
          <td>${fechaPedido}</td>
          <td>${fechaEntregaFormateada}</td>
          <td>${pedido.total.toLocaleString()} FCFA</td>
          <td>${pedido.estado}</td>
        </tr>
      `;
      tablaPedidos.innerHTML += nuevaFila;
    });
    asignarEventoAFilasPedidos();
  }

  function obtenerNombreProveedor(valorProveedor) {
    const opciones = proveedorPedido.options;
    for (let i = 0; i < opciones.length; i++) {
      if (opciones[i].value === valorProveedor) {
        return opciones[i].textContent;
      }
    }
    return "Proveedor desconocido";
  }

  btnEliminarLinea.addEventListener("click", function (e) {
    e.preventDefault();

    if (lineaEditando === null) {
      alert("Por favor, seleccione una línea para eliminarla");
      return;
    }

    const confirmar = confirm("¿Está seguro de que desea eliminar esta línea?");
    if (!confirmar) return;

    const index = parseInt(lineaEditando) - 1;
    if (index >= 0 && index < lineasPedidoActual.length) {
      lineasPedidoActual.splice(index, 1);
      actualizarTablaLineas();
      formularioLineaPedido.reset();
      btnAgregarLinea.innerHTML =
        '<i class="fas fa-plus me-1"></i> Agregar Línea';
      subtotalLinea.value = "0 FCFA";
      lineaEditando = null;
      calcularTotalPedido();
      alert("Línea eliminada exitosamente");
    }
  });

  btnEliminarPedido.addEventListener("click", function (e) {
    e.preventDefault();

    if (pedidoEditando === null) {
      alert("Por favor, seleccione un pedido para eliminarlo");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar este pedido?"
    );
    if (!confirmar) return;

    const index = parseInt(pedidoEditando) - 1;
    if (index >= 0 && index < pedidos.length) {
      pedidos.splice(index, 1);
      cargarTablaPedidos();
      formularioPedido.reset();
      formularioLineaPedido.reset();
      btnCrearPedido.innerHTML = '<i class="fas fa-save me-1"></i> Guardar';
      subtotalLinea.value = "0 FCFA";
      pedidoEditando = null;
      lineaEditando = null;
      lineasPedidoActual = [];
      tablaLineas.innerHTML = "";
      alert("Pedido eliminado exitosamente");
    }
  });

  btnImprimirPedido.addEventListener("click", function (e) {
    e.preventDefault();

    if (pedidoEditando === null) {
      alert("Por favor, seleccione un pedido para imprimir");
      return;
    }

    const index = parseInt(pedidoEditando) - 1;
    if (index >= 0 && index < pedidos.length) {
      imprimirPedido(pedidos[index]);
    } else {
      alert("No se pudo encontrar el pedido seleccionado");
    }
  });

  function imprimirPedido(pedido) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("PEDIDO A PROVEEDOR", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Proveedor: ${obtenerNombreProveedor(pedido.proveedor)}`, 20, 30);
    doc.text(
      `Fecha de Pedido: ${new Date(pedido.fechaRealizacion).toLocaleDateString(
        "es-ES"
      )}`,
      20,
      40
    );
    doc.text(
      `Fecha Esperada de Entrega: ${new Date(
        pedido.fechaEntrega
      ).toLocaleDateString("es-ES")}`,
      20,
      50
    );
    doc.text(`Estado: ${pedido.estado}`, 20, 60);
    doc.text("Líneas del Pedido", 20, 75);

    let yPosition = 85;

    doc.setFillColor(200, 200, 200);
    doc.rect(20, yPosition, 170, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("Producto", 25, yPosition + 7);
    doc.text("Cantidad", 100, yPosition + 7);
    doc.text("Precio", 130, yPosition + 7);
    doc.text("Subtotal", 160, yPosition + 7);

    yPosition += 15;
    pedido.lineasPedidos.forEach((linea, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(linea.producto, 25, yPosition);
      doc.text(linea.cantidad.toString(), 100, yPosition);
      doc.text(linea.precio.toLocaleString() + " FCFA", 130, yPosition);
      doc.text(linea.subTotal.toLocaleString() + " FCFA", 160, yPosition);

      yPosition += 10;
    });

    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`TOTAL: ${pedido.total.toLocaleString()} FCFA`, 130, yPosition);

    doc.save(
      `pedido_${obtenerNombreProveedor(pedido.proveedor)}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  }

  cargarDatosIniciales();

  function cargarDatosIniciales() {
    const pedido1 = new Pedido("1", "2023-06-20", "Recibido", 1000000);
    pedido1.fechaRealizacion = new Date("2023-06-15");
    pedido1.lineasPedidos = [
      new LineaPedido("Alas de Gallina", 50, 1700),
      new LineaPedido("Rabos de Cerdo", 30, 2500),
    ];

    const pedido2 = new Pedido("2", "2025-06-25", "Enviado", 100000);
    pedido2.fechaRealizacion = new Date("2025-06-18");
    pedido2.lineasPedidos = [new LineaPedido("HP laptop", 5, 150000)];

    pedidos.push(pedido1, pedido2);
    cargarTablaPedidos();
  }
});
