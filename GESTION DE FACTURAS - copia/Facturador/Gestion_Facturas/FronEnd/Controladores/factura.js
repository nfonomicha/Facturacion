import { Factura } from "../Entidades/factura.js";
import { LineaFactura } from "../Entidades/lineaFactura.js";

document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const formularioFactura = document.getElementById("formularioFactura");
  const formularioLineaFactura = document.getElementById(
    "formularioLineaFactura"
  );
  const btnCrearFactura = document.getElementById("btnCrearFactura");
  const btnEliminarFactura = document.getElementById("btnEliminarFactura");
  const btnCancelarFactura = document.getElementById("btnCancelarFactura");
  const btnImprimirFactura = document.getElementById("btnImprimirFactura");
  const btnAgregarLinea = document.getElementById("btnAgregarLinea");
  const btnEliminarLinea = document.getElementById("btnEliminarLinea");
  const btnLimpiarLineas = document.getElementById("btnLimpiarLineas");
  const tablaFacturas = document.getElementById("cuerpoTablaFacturas");
  const tablaLineas = document.getElementById("cuerpoTablaLineas");
  const campoBusquedaFactura = document.getElementById("buscarFactura");
  const campoBusquedaLineas = document.getElementById("buscarLineas");
  const fechaVencimiento = document.getElementById("fechaVencimiento");
  const fechaRealizacion = document.getElementById("fechaRealizacion");
  const formaPago = document.getElementById("formaPago");
  const estadoFactura = document.getElementById("estadoFactura");
  const productoFactura = document.getElementById("productoFactura");
  const cantidadFactura = document.getElementById("cantidadFactura");
  const precioFactura = document.getElementById("precioFactura");
  const subtotalLinea = document.getElementById("subtotalLinea");
  const totalFacturaDiv = document.getElementById("totalFactura");

  // Variables de estado
  let facturas = [];
  let lineasFacturaActual = [];
  let facturaEditando = null;
  let lineaEditando = null;

  // Configurar fecha actual
  const fechaActual = new Date().toISOString().split("T")[0];
  fechaRealizacion.value = fechaActual;

  // Inicializar eventos
  inicializarEventos();
  cargarDatosIniciales();

  function inicializarEventos() {
    // Eventos para calcular subtotal
    cantidadFactura.addEventListener("input", calcularSubtotal);
    precioFactura.addEventListener("input", calcularSubtotal);

    // Eventos de botones
    btnCancelarFactura.addEventListener("click", cancelarFactura);
    btnLimpiarLineas.addEventListener("click", limpiarLineas);
    btnAgregarLinea.addEventListener("click", manejarLinea);
    btnCrearFactura.addEventListener("click", manejarFactura);
    btnEliminarLinea.addEventListener("click", eliminarLinea);
    btnEliminarFactura.addEventListener("click", eliminarFactura);
    btnImprimirFactura.addEventListener("click", imprimirFacturaActual);

    // Eventos de búsqueda
    campoBusquedaFactura.addEventListener("input", () =>
      buscarEnTabla(campoBusquedaFactura.value.toLowerCase(), tablaFacturas)
    );
    campoBusquedaLineas.addEventListener("input", () =>
      buscarEnTabla(campoBusquedaLineas.value.toLowerCase(), tablaLineas)
    );
  }

  function calcularSubtotal() {
    const cantidad = parseInt(cantidadFactura.value) || 0;
    const precio = parseInt(precioFactura.value) || 0;
    const subtotal = cantidad * precio;
    subtotalLinea.value = subtotal.toLocaleString() + " FCFA";
  }

  function actualizarTotalFactura() {
    const total = calcularTotalFactura();
    if (totalFacturaDiv) {
      totalFacturaDiv.textContent = total.toLocaleString() + " FCFA";
    }
  }

  function calcularTotalFactura() {
    return lineasFacturaActual.reduce(
      (total, linea) => total + (linea.subTotal || 0),
      0
    );
  }

  // Función para cargar líneas de factura
  function cargarLineasFactura(idFactura) {
    const facturaIndex = parseInt(idFactura) - 1;

    if (facturaIndex >= 0 && facturaIndex < facturas.length) {
      const factura = facturas[facturaIndex];

      // IMPORTANTE: Verificar cómo se almacenan las líneas en la factura
      // Asegurarse de que factura.lineasFacturas existe
      lineasFacturaActual = factura.lineasFacturas
        ? [...factura.lineasFacturas]
        : [];

      console.log("Cargando líneas para factura:", idFactura);
      console.log("Líneas encontradas:", lineasFacturaActual);

      actualizarTablaLineas();
      actualizarTotalFactura();

      // También cargar los datos de la factura en el formulario
      cargarDatosFacturaEnFormulario(factura);
    } else {
      lineasFacturaActual = [];
      tablaLineas.innerHTML = "";
      if (totalFacturaDiv) {
        totalFacturaDiv.textContent = "0 FCFA";
      }
    }
  }

  function cargarDatosFacturaEnFormulario(factura) {
    // Cargar datos de la factura en el formulario
    fechaRealizacion.value = formatDateForInput(factura.fechaRealizacion);
    fechaVencimiento.value = formatDateForInput(factura.fechaVencimiento);
    estadoFactura.value = factura.estado;
    formaPago.value = factura.formaPago;
  }

  function formatDateForInput(dateString) {
    // Convertir fecha de formato español a YYYY-MM-DD
    if (!dateString) return "";

    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }

    // Si está en formato DD/MM/YYYY, convertirlo
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Si es un objeto Date
    if (dateString instanceof Date) {
      return dateString.toISOString().split("T")[0];
    }

    return dateString;
  }

  function actualizarTablaLineas() {
    tablaLineas.innerHTML = "";

    if (lineasFacturaActual.length === 0) {
      tablaLineas.innerHTML =
        '<tr><td colspan="5" class="text-center">No hay líneas de factura</td></tr>';
      return;
    }

    lineasFacturaActual.forEach((linea, index) => {
      const nuevaFila = document.createElement("tr");
      nuevaFila.setAttribute("data-id", index + 1);
      nuevaFila.innerHTML = `
        <td>${index + 1}</td>
        <td>${linea.producto || ""}</td>
        <td>${linea.cantidad || 0}</td>
        <td>${(linea.precio || 0).toLocaleString()}</td>
        <td>${(linea.subTotal || 0).toLocaleString()} FCFA</td>
      `;

      // Agregar evento click a la fila
      nuevaFila.addEventListener("click", () => seleccionarLinea(index));
      tablaLineas.appendChild(nuevaFila);
    });
  }

  function seleccionarLinea(index) {
    if (index >= 0 && index < lineasFacturaActual.length) {
      const linea = lineasFacturaActual[index];
      productoFactura.value = linea.producto || "";
      cantidadFactura.value = linea.cantidad || "";
      precioFactura.value = linea.precio || "";
      calcularSubtotal();

      btnAgregarLinea.innerHTML =
        '<i class="fas fa-save me-1"></i> Guardar Cambios';
      lineaEditando = index + 1;
    }
  }

  function cancelarFactura() {
    formularioFactura.reset();
    formularioLineaFactura.reset();
    btnCrearFactura.innerHTML = '<i class="fas fa-save me-1"></i> Guardar';
    subtotalLinea.value = "0 FCFA";
    facturaEditando = null;
    lineaEditando = null;
    lineasFacturaActual = [];
    tablaLineas.innerHTML =
      '<tr><td colspan="5" class="text-center">No hay líneas de factura</td></tr>';

    if (totalFacturaDiv) {
      totalFacturaDiv.textContent = "0 FCFA";
    }

    fechaRealizacion.value = fechaActual;
  }

  function limpiarLineas() {
    formularioLineaFactura.reset();
    btnAgregarLinea.innerHTML =
      '<i class="fas fa-plus me-1"></i> Agregar Línea';
    subtotalLinea.value = "0 FCFA";
    lineaEditando = null;
  }

  function buscarEnTabla(texto, tabla) {
    const filas = tabla.getElementsByTagName("tr");
    for (let fila of filas) {
      const textoFila = fila.textContent.toLowerCase();
      fila.style.display = textoFila.includes(texto) ? "" : "none";
    }
  }

  function manejarLinea(e) {
    e.preventDefault();

    const producto = productoFactura.value.trim();
    const cantidad = parseInt(cantidadFactura.value);
    const precio = parseInt(precioFactura.value);

    if (
      !producto ||
      isNaN(cantidad) ||
      isNaN(precio) ||
      cantidad <= 0 ||
      precio <= 0
    ) {
      alert("Por favor, complete todos los campos correctamente");
      return;
    }

    const subtotal = cantidad * precio;

    if (lineaEditando) {
      const index = parseInt(lineaEditando) - 1;
      if (index >= 0 && index < lineasFacturaActual.length) {
        // Actualizar línea existente
        lineasFacturaActual[index] = new LineaFactura(
          producto,
          cantidad,
          precio
        );
        alert("Línea actualizada exitosamente");
      }
    } else {
      // Crear nueva línea
      const nuevaLinea = new LineaFactura(producto, cantidad, precio);
      lineasFacturaActual.push(nuevaLinea);
      alert("Línea agregada exitosamente");
    }

    actualizarTablaLineas();
    actualizarTotalFactura();
    limpiarLineas();
  }

  function manejarFactura(e) {
    e.preventDefault();

    const fechaR = fechaRealizacion.value;
    const fechaV = fechaVencimiento.value;
    const estado = estadoFactura.value;
    const formaP = formaPago.value;
    const total = calcularTotalFactura();

    if (!fechaR || !fechaV || !estado || !formaP) {
      alert("Por favor, complete todos los campos de la factura");
      return;
    }

    if (lineasFacturaActual.length === 0) {
      alert("Debe agregar al menos una línea a la factura");
      return;
    }

    if (facturaEditando) {
      // Actualizar factura existente
      const index = parseInt(facturaEditando) - 1;
      if (index >= 0 && index < facturas.length) {
        facturas[index] = new Factura(formaP, fechaV, estado, total);
        facturas[index].setFechaR(fechaR);
        facturas[index].setLineas([...lineasFacturaActual]);
        alert("Factura actualizada exitosamente");
      }
    } else {
      // Crear nueva factura
      const nuevaFactura = new Factura(formaP, fechaV, estado, total);
      nuevaFactura.setFechaR(fechaR);
      nuevaFactura.setLineas([...lineasFacturaActual]);
      facturas.push(nuevaFactura);
      alert("Factura creada exitosamente");
    }

    cargarTablaFacturas();
    cancelarFactura();
  }

  function cargarTablaFacturas() {
    tablaFacturas.innerHTML = "";

    facturas.forEach((factura, index) => {
      const fechaFactura = new Date(
        factura.fechaRealizacion
      ).toLocaleDateString("es-ES");
      const fechaVencimiento = new Date(
        factura.fechaVencimiento
      ).toLocaleDateString("es-ES");

      const nuevaFila = document.createElement("tr");
      nuevaFila.setAttribute("data-id", index + 1);
      nuevaFila.innerHTML = `
        <td>${index + 1}</td>
        <td>${fechaFactura}</td>
        <td>${fechaVencimiento}</td>
        <td>${factura.total.toLocaleString()} FCFA</td>
        <td>${factura.estado}</td>
      `;

      // Agregar evento click a la fila
      nuevaFila.addEventListener("click", () => {
        facturaEditando = index + 1;
        btnCrearFactura.innerHTML =
          '<i class="fas fa-save me-1"></i> Guardar Cambios';
        cargarLineasFactura(facturaEditando);
      });

      tablaFacturas.appendChild(nuevaFila);
    });
  }

  function eliminarLinea(e) {
    e.preventDefault();

    if (lineaEditando === null) {
      alert("Por favor, seleccione una línea para eliminarla");
      return;
    }

    const confirmar = confirm("¿Está seguro de que desea eliminar esta línea?");
    if (!confirmar) return;

    const index = parseInt(lineaEditando) - 1;
    if (index >= 0 && index < lineasFacturaActual.length) {
      lineasFacturaActual.splice(index, 1);
      actualizarTablaLineas();
      actualizarTotalFactura();
      limpiarLineas();
      alert("Línea eliminada exitosamente");
    }
  }

  function eliminarFactura(e) {
    e.preventDefault();

    if (facturaEditando === null) {
      alert("Por favor, seleccione una factura para eliminarla");
      return;
    }

    const confirmar = confirm(
      "¿Está seguro de que desea eliminar esta factura?"
    );
    if (!confirmar) return;

    const index = parseInt(facturaEditando) - 1;
    if (index >= 0 && index < facturas.length) {
      facturas.splice(index, 1);
      cargarTablaFacturas();
      cancelarFactura();
      alert("Factura eliminada exitosamente");
    }
  }

  function imprimirFacturaActual(e) {
    e.preventDefault();

    if (facturaEditando === null) {
      alert("Por favor, seleccione una factura para imprimir");
      return;
    }

    const index = parseInt(facturaEditando) - 1;
    if (index >= 0 && index < facturas.length) {
      imprimirFactura(facturas[index]);
    } else {
      alert("No se pudo encontrar la factura seleccionada");
    }
  }

  function imprimirFactura(factura) {
    if (!window.jspdf) {
      alert("Error: jsPDF no está cargado");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("FACTURA", 105, 15, { align: "center" });
    doc.setFontSize(12);

    // Información de la factura
    doc.text(
      `Fecha de Facturación: ${new Date(
        factura.fechaRealizacion
      ).toLocaleDateString("es-ES")}`,
      20,
      35
    );
    doc.text(
      `Fecha de Vencimiento: ${new Date(
        factura.fechaVencimiento
      ).toLocaleDateString("es-ES")}`,
      20,
      45
    );
    doc.text(`Estado: ${factura.estado}`, 20, 55);
    doc.text(`Forma de Pago: ${factura.formaPago}`, 20, 65);
    doc.text(`Total: ${factura.total.toLocaleString()} FCFA`, 20, 75);

    // Tabla de líneas
    doc.text("Detalle de Productos", 20, 90);

    let yPosition = 100;
    doc.setFillColor(200, 200, 200);
    doc.rect(20, yPosition, 170, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("#", 25, yPosition + 7);
    doc.text("Producto", 35, yPosition + 7);
    doc.text("Cantidad", 100, yPosition + 7);
    doc.text("Precio", 130, yPosition + 7);
    doc.text("Subtotal", 160, yPosition + 7);

    yPosition += 15;

    // Verificar y mostrar líneas
    if (factura.lineasFacturas && factura.lineasFacturas.length > 0) {
      factura.lineasFacturas.forEach((linea, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text((index + 1).toString(), 25, yPosition);
        doc.text(linea.producto || "Producto", 35, yPosition);
        doc.text((linea.cantidad || 0).toString(), 100, yPosition);
        doc.text(
          (linea.precio || 0).toLocaleString() + " FCFA",
          130,
          yPosition
        );
        doc.text(
          (linea.subTotal || 0).toLocaleString() + " FCFA",
          160,
          yPosition
        );

        yPosition += 10;
      });
    } else {
      doc.text("No hay líneas en esta factura", 25, yPosition);
    }

    doc.save(`Factura_${new Date().toISOString().split("T")[0]}.pdf`);
  }

  function cargarDatosIniciales() {
    try {
      // Crear facturas de ejemplo
      const factura1 = new Factura("Efectivo", "2023-12-31", "Pagada", 225000);
      factura1.setFechaR("2023-06-15");

      // Crear líneas usando la clase LineaFactura
      const linea1 = new LineaFactura("Alas de Gallina", 50, 1700);
      const linea2 = new LineaFactura("Rabos de Cerdo", 30, 2500);

      // IMPORTANTE: Asignar las líneas usando setLineas
      factura1.setLineas([linea1, linea2]);

      const factura2 = new Factura(
        "Tarjeta",
        "2025-06-25",
        "Pendiente",
        750000
      );
      factura2.setFechaR("2025-06-18");

      const linea3 = new LineaFactura("Laptop HP", 5, 150000);
      factura2.setLineas([linea3]);

      facturas = [factura1, factura2];

      console.log("Facturas cargadas:", facturas);
      console.log("Líneas de factura 1:", factura1.lineasFacturas);
      console.log("Líneas de factura 2:", factura2.lineasFacturas);

      cargarTablaFacturas();
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  }
});
