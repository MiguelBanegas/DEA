// Función para formatear la fecha como "Vier 6/6/2025"
function formatearFecha(fecha) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  return `${diaSemana} ${dia}/${mes}/${anio}`;
}

window.addEventListener("DOMContentLoaded", function () {
  const hoy = new Date();
  const fechaInput = document.getElementById("fechaInput");
  const fechaTexto = document.getElementById("fechaTexto");
  fechaInput.value = hoy.toISOString().slice(0, 10);
  fechaTexto.textContent = formatearFecha(hoy);

  fechaInput.addEventListener("change", function () {
    const seleccionada = new Date(this.value);
    if (!isNaN(seleccionada)) {
      fechaTexto.textContent = formatearFecha(seleccionada);
    }
  });
});

function agregarFila() {
  const tabla = document
    .getElementById("medicionTabla")
    .getElementsByTagName("tbody")[0];
  const fila = tabla.insertRow();

  // Contar filas existentes para autoincrementar el primer campo
  const numero = tabla.rows.length;
  
  
  const selects = {
    2: [
      "Lecho seco",

      "Arcilloso",

      "Pantanoso",

      "Lluvias recientes",

      "Arenoso seco o hÃºmedo",

      "Otro",
    ],

    3: [
      "Transformador",

      "Seguridad",

      "ProtecciÃ³n de Equipos",

      "InformÃ¡tica",

      "IluminaciÃ³n",

      "Pararayos",

      "Otros",
    ],

    4: ["TT", "TN-S", "TN-C", "TN-C-S", "IT"],

    6: ["SI", "NO"],

    7: ["SI", "NO"],

    8: ["SI", "NO"],

    9: ["DD", "IA", "Fusible"],

    10: ["SI", "NO"],
  };

  let primerInput = null;

  for (let i = 0; i < 11; i++) {
    const celda = fila.insertCell(i);
    celda.className = "align-middle text-center";
    if (i === 0) {
      celda.textContent = numero;
      celda.contentEditable = false;
      celda.classList.add("bg-light");
    } else if (i === 1) {
      celda.contentEditable = true;
      celda.textContent = "";
      celda.classList.add("bg-warning-subtle");
      celda.addEventListener("focus", function () {
        document.execCommand("selectAll", false, null);
      });
      if (primerInput === null) primerInput = celda;
    } else if (selects[i]) {
      const select = document.createElement("select");
      select.className = "form-select form-select-sm";
      select.style.fontSize = "10px";
      selects[i].forEach((opcion) => {
        const opt = document.createElement("option");
        opt.value = opcion;
        opt.text = opcion;
        select.appendChild(opt);
      });
      celda.appendChild(select);
      if (primerInput === null) primerInput = select;
    } else if (i === 5) {
      celda.contentEditable = true;
      celda.textContent = (Math.random() * 100).toFixed(1);
      celda.classList.add("bg-warning-subtle");
      celda.addEventListener("focus", function () {
        document.execCommand("selectAll", false, null);
      });
      if (primerInput === null) primerInput = celda;
    } else {
      // Solo texto plano en cada celda
      celda.textContent = "Texto plano";
      celda.classList.add("bg-warning-subtle");
      celda.addEventListener("focus", function () {
        document.execCommand("selectAll", false, null);
      });
      if (primerInput === null) primerInput = celda;
    }
  }

  // Botón para eliminar fila
  const celdaEliminar = fila.insertCell(11);
  const botonEliminar = document.createElement("button");
  botonEliminar.innerText = "Eliminar";
  // botonEliminar.className = "btn btn-danger btn-sm";
  botonEliminar.onclick = () => {
    if (confirm("¿Estás seguro de eliminar esta fila?")) {
      fila.remove();
      recontarNumeros();
    }
  };
  celdaEliminar.appendChild(botonEliminar);

  // Pone el foco en la primera celda editable
  setTimeout(() => {
    if (primerInput && primerInput.focus) {
      primerInput.focus();
    } else if (primerInput && primerInput.firstChild) {
      primerInput.firstChild.focus();
    }
  }, 0);
}

function guardarComoPDF() {
  window.scrollTo(0, 0);
  const contenedor = document.getElementById("exportPDF");
  const tabla = document.getElementById("medicionTabla");
  contenedor.classList.add("pdf-export", "ocultar-botones");
  tabla.classList.add("ocultar-eliminar");

  // Agrega fecha/hora arriba a la derecha SOLO para el PDF
  const ahora = new Date();
  const fechaHora = ahora.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const fechaDiv = document.createElement("div");
  fechaDiv.className = "fecha-hora-impresion";
  fechaDiv.style.position = "absolute";
  fechaDiv.style.top = "20px";
  fechaDiv.style.right = "40px";
  fechaDiv.style.fontSize = "11px";
  fechaDiv.style.fontWeight = "bold";
  fechaDiv.style.color = "#333";
  fechaDiv.textContent = fechaHora;
  contenedor.prepend(fechaDiv);

  // CSS para evitar cortes de filas y encabezados
  const style = document.createElement("style");
  style.id = "pdf-pagebreak-style";
  style.innerHTML = `
    thead { display: table-header-group; }
    tr, th, td { page-break-inside: avoid !important; break-inside: avoid !important; }
    table { page-break-inside: auto; break-inside: auto; }
    .fecha-hora-impresion {
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 11px;
      font-weight: bold;
      color: #333;
    }
  `;
  document.head.appendChild(style);

  // Fuerza reflow
  void tabla.offsetHeight;

  setTimeout(() => {
    const opciones = {
      margin: [5, 5, 15, 5],
      filename: "planillaRelevMedicRes900.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0, scrollX: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf()
      .set(opciones)
      .from(contenedor)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Página ${i} de ${totalPages}`,
            pageWidth - 30,
            pageHeight - 10
          );
        }
      })
      .save()
      .then(() => {
        contenedor.classList.remove("pdf-export", "ocultar-botones");
        tabla.classList.remove("ocultar-eliminar");
        const styleTag = document.getElementById("pdf-pagebreak-style");
        if (styleTag) styleTag.remove();
        fechaDiv.remove(); // Quita la fecha/hora del DOM
      })
      .catch((err) => {
        contenedor.classList.remove("pdf-export", "ocultar-botones");
        tabla.classList.remove("ocultar-eliminar");
        const styleTag = document.getElementById("pdf-pagebreak-style");
        if (styleTag) styleTag.remove();
        fechaDiv.remove();
        alert("Error al generar el PDF: " + err);
        console.error(err);
      });
  }, 700); // Usa 350ms para asegurar el reflow
}

function imprimirPDF() {
  const contenedor = document.getElementById("exportPDF");
  const tabla = document.getElementById("medicionTabla");
  const tableResponsive = contenedor.querySelector(".table-responsive");
  let removedResponsive = false;
  if (tableResponsive) {
    tableResponsive.classList.remove("table-responsive");
    removedResponsive = true;
  }

  contenedor.classList.add("pdf-export", "ocultar-botones");
  tabla.classList.add("ocultar-eliminar");
  tabla.classList.add("tabla-pdf-chica");

  // Fecha y hora actual
  const ahora = new Date();
  const fechaHora = ahora.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const ventana = window.open("", "_blank");

  ventana.document.open();
  ventana.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        ${document.head.innerHTML}
        <style>
          .table-responsive { overflow-x: visible !important; max-width: none !important; }
          table, .pdf-export table {
            width: 180mm !important;
            max-width: 180mm !important;
            min-width: 0 !important;
            table-layout: fixed !important;
          }
          .pdf-export th, .pdf-export td {
            font-size: 9px !important;
            padding: 2px 2px !important;
          }
          .pdf-export th, .pdf-export td {
            word-break: break-word !important;
            white-space: normal !important;
          }
          .fecha-hora-impresion {
            position: absolute;
            top: 20px;
            right: 40px;
            font-size: 11px;
            font-weight: bold;
            color: #333;
          }
          @media print {
            body { margin: 0; }
            .fecha-hora-impresion { position: fixed; top: 20px; right: 40px; }
          }
        </style>
      </head>
      <body>
        <div class="fecha-hora-impresion">${fechaHora}</div>
      </body>
    </html>
  `);
  ventana.document.close();

  ventana.onload = () => {
    const contenidoClonado = contenedor.cloneNode(true);
    ventana.document.body.appendChild(contenidoClonado);

    setTimeout(() => {
      ventana.focus();
      ventana.print();
      // ventana.close();

      contenedor.classList.remove("pdf-export", "ocultar-botones");
      tabla.classList.remove("ocultar-eliminar");
      tabla.classList.remove("tabla-pdf-chica");
      if (removedResponsive && tableResponsive) {
        tableResponsive.classList.add("table-responsive");
      }
    }, 500);
  };
}

// Convierte a mayúsculas todos los campos de texto al escribir o cambiar
document.addEventListener("DOMContentLoaded", function () {
  // Para inputs de texto
  document.querySelectorAll('input[type="text"]').forEach(function (input) {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  });
  // Para celdas editables de la tabla
  document
    .querySelectorAll('#medicionTabla td[contenteditable="true"]')
    .forEach(function (td) {
      td.addEventListener("input", function () {
        this.textContent = this.textContent.toUpperCase();
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const sectorInput = document.getElementById("sectorInput");
  const fechaInput = document.getElementById("fechaInput");
  if (sectorInput && fechaInput) {
    sectorInput.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        fechaInput.focus();
      }
    });
  }
});
