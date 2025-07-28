//Script to pre-fill date
   
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);      
      
      const day = ('0' + today.getDate()).slice(-2);
      document.getElementById('fecha_medicion').value = `${year}-${month}-${day}`;
      
      //Script to auto-expand textarea
    document.addEventListener("DOMContentLoaded", function () { 
     const metodologiaTextarea = document.getElementById('metodologia');
    
     metodologiaTextarea.addEventListener('input', () => {
     metodologiaTextarea.style.height = 'auto';
          metodologiaTextarea.style.height = metodologiaTextarea.scrollHeight + 'px';
        });
        // Initial resize on load
        metodologiaTextarea.dispatchEvent(new Event('input'));
    });
    document.addEventListener("DOMContentLoaded", function () {
 const observacionesTextarea = document.getElementById('observaciones');
 observacionesTextarea.addEventListener('input', () => { observacionesTextarea.style.height = 'auto'; observacionesTextarea.style.height = observacionesTextarea.scrollHeight + 'px'; });
    // Initial resize on load
    observacionesTextarea.dispatchEvent(new Event('input'));
});

document.addEventListener('DOMContentLoaded', function() {
  const selects = document.querySelectorAll('select');

  selects.forEach(selectElement => {
    selectElement.addEventListener('change', function() {
      if (this.value === 'NO' || this.value === 'No' || this.value === 'No cumple') {
        this.style.color = 'red';
        this.style.fontWeight = 'bold';
      } else {
        this.style.color = ''; // Resetea el color para otras opciones
      }
    });

    // Aplica el color inicial si la opción 'No' o 'No cumple' ya está seleccionada al cargar la página
    if (this.value === 'NO' || selectElement.value === 'No' || selectElement.value === 'No cumple') {
      selectElement.style.color = 'red';
      selectElement.style.fontWeight = 'bold';
    }
  });
});

// Script para mostrar la imagen seleccionada
document.addEventListener('DOMContentLoaded', function() {
  const inputImagen = document.getElementById('imagen_adjunta');
  const contenedorImagenes = document.getElementById('contenedor_imagenes_adjuntas'); // Assuming you add this container in your HTML

  inputImagen.addEventListener('change', function() {
    contenedorImagenes.innerHTML = ''; // Clear previous images

    for (const file of this.files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imagenDiv = document.createElement('div');
          imagenDiv.classList.add('imagen-adjunta'); // Add a class for styling if needed

          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.maxWidth = '100%'; // Ensure image fits within container

          const nombreArchivo = document.createElement('p');
          nombreArchivo.textContent = file.name;

          const botonEliminar = document.createElement('button');
          botonEliminar.textContent = 'Eliminar';
          botonEliminar.onclick = function() {
            imagenDiv.remove(); // Remove the image container when button is clicked
          };

          imagenDiv.appendChild(img);
          imagenDiv.appendChild(nombreArchivo);
          imagenDiv.appendChild(botonEliminar);
          contenedorImagenes.appendChild(imagenDiv);
        }
        reader.readAsDataURL(file);
      }
    }
  });
});

// Function to save the form as PDF
function guardarComoPDF() {
  // Muestra el indicador de carga
  document.getElementById('loading-indicator').style.display = 'block';

  window.scrollTo(0, 0);
  const contenedor = document.getElementById("exportPDF");
  const tabla = document.getElementById("medicionTabla"); // Assuming you have a table with this ID if needed for page breaks
  contenedor.classList.add("pdf-export", "ocultar-botones");
  if (tabla) {
    tabla.classList.add("ocultar-eliminar");
  }

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

  // CSS para evitar cortes de filas y encabezados (partially handled by html2pdf options)
  // Additional styling for print can be added in style.css with @media print

  // Fuerza reflow (often not strictly necessary with modern browsers and libraries)
  // void tabla.offsetHeight;

  setTimeout(() => {
    const opciones = {
      margin: [5, 5, 15, 5],
      filename: "planillaMedicPAT1.pdf",
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
        if (tabla) {
          tabla.classList.remove("ocultar-eliminar");
        }
        fechaDiv.remove(); // Quita la fecha/hora del DOM
        // Oculta el indicador de carga después de que se complete la descarga
        document.getElementById('loading-indicator').style.display = 'none';
      })
      .catch((err) => {
        console.error('Error al generar el PDF:', err);
        contenedor.classList.remove("pdf-export", "ocultar-botones");
        if (tabla) {
          tabla.classList.remove("ocultar-eliminar");
        }
        fechaDiv.remove();
        alert("Error al generar el PDF: " + err);
        // Asegúrate de ocultar el indicador incluso si hay un error
        document.getElementById('loading-indicator').style.display = 'none';
      });
  }, 350); // Use a small delay to ensure DOM updates
}
