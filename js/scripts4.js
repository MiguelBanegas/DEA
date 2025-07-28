document.addEventListener("DOMContentLoaded", function () {
  // === 1. Auto-completar fecha ===
  const fechaInput = document.getElementById("fecha_medicion");
  if (fechaInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    fechaInput.value = `${year}-${month}-${day}`;
  }

  // === 2. Auto-expand textarea ===
  const autoExpandTextarea = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const resize = () => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      };
      el.addEventListener("input", resize);
      resize();
    }
  };

  autoExpandTextarea("metodologia");
  autoExpandTextarea("observaciones");

  // === 3. Cambiar estilo de select ===
  const badValues = ["no", "no cumple"];
  document.querySelectorAll("select").forEach((select) => {
    const checkValue = () => {
      const val = select.value.toLowerCase();
      if (badValues.includes(val)) {
        select.style.color = "red";
        select.style.fontWeight = "bold";
      } else {
        select.style.color = "";
        select.style.fontWeight = "";
      }
    };
    select.addEventListener("change", checkValue);
    checkValue(); // en carga
  });

  // === 4. Previsualizar imagen ===
/*   const inputImagen = document.getElementById("imagen_adjunta"); */
/*   const contenedorImagenes = document.getElementById("contenedor_imagenes_adjuntas"); */
/*  */
/*   if (inputImagen && contenedorImagenes) { */
/*     inputImagen.addEventListener("change", function () { */
/*       contenedorImagenes.innerHTML = ""; */
/*       Array.from(this.files).forEach((file) => { */
/*         if (file.type.startsWith("image/")) { */
/*           const reader = new FileReader(); */
/*           reader.onload = function (e) { */
/*             const div = document.createElement("div"); */
/*             div.classList.add("imagen-adjunta"); */
/*  */
/*             const img = document.createElement("img"); */
/*             img.src = e.target.result; */
/*             //img.alt = file.name; */
/*             img.style.maxWidth = "100%"; */
/*  */
/*             const btn = document.createElement("button"); */
/*             btn.textContent = "Eliminar"; */
/*             btn.onclick = () => div.remove(); */
/*  */
/*             div.append(img, btn); */
/*             contenedorImagenes.appendChild(div); */
/*           }; */
/*           reader.readAsDataURL(file); */
/*         } */
/*       }); */
/*     }); */
/*   } */
/* }); */
  const inputImagen = document.getElementById("imagen_adjunta");
  const contenedorImagenes = document.getElementById("contenedor_imagenes_adjuntas");
  const statusDisplay = document.getElementById("file-upload-status"); // El nuevo span para el texto

  if (inputImagen && contenedorImagenes && statusDisplay) {
    inputImagen.addEventListener("change", function () {
      // 1. Actualizar el texto de estado
      if (this.files.length > 0) {
        // Muestra cuántos archivos se seleccionaron
        statusDisplay.textContent = `${this.files.length} archivo(s) seleccionado(s)`;
      } else {
        // No muestra nada si no hay archivos
        statusDisplay.textContent = "";
      }
      
      // 2. Lógica existente para previsualizar las imágenes
      contenedorImagenes.innerHTML = "";
      Array.from(this.files).forEach((file) => {
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
          alert(`El archivo ${file.name} no es un tipo de imagen soportado para el PDF`);
          return; // Saltá la imagen
        }
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const div = document.createElement("div");
            div.classList.add("imagen-adjunta");

            const img = document.createElement("img");
            img.src = e.target.result;
            // Corregido también en la respuesta anterior para no mostrar el nombre del archivo
            img.alt = "Vista previa de imagen adjunta"; 
            img.style.maxWidth = "100%";

            const btn = document.createElement("button");
            btn.textContent = "Eliminar";
            btn.onclick = () => div.remove();

            div.append(img, btn);
            contenedorImagenes.appendChild(div);
          };
          reader.readAsDataURL(file);
        } 
      });
    });
  }
});
// Function to save the form as PDF
function guardarComoPDF() {
  document.querySelectorAll("img").forEach((img, i) => {
    console.log(img.src)
  });
  
  // Muestra el indicador de carga
  document.getElementById('loading-indicator').style.display = 'block';

  window.scrollTo(0, 0);
  document.querySelectorAll("img").forEach((img) => {
    img.crossOrigin = "anonymous";
  });
  document.querySelectorAll("img").forEach((img) => {
    if (img.src.includes("svg+xml")) console.warn("🔥 Imagen SVG inline detectada:", img.src);
  });
    
  const contenedor = document.getElementById("exportPDF");
  const tabla = document.getElementById("medicionTabla"); // Assuming you have a table with this ID if needed for page breaks
  contenedor.classList.add("pdf-export", "ocultar-botones");

  const svgs = contenedor.querySelectorAll("svg");
  svgs.forEach(svg => svg.style.display = "none");

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
    const svgImages = contenedor.querySelectorAll("img[src^='data:image/svg+xml']");
    const svgImgs = contenedor.querySelectorAll("img[src^='data:image/svg+xml']");
    const inlineSvgs = contenedor.querySelectorAll("svg");
    const bgWithSvg = Array.from(contenedor.querySelectorAll("*")).filter(el =>
      el.style.backgroundImage.includes("data:image/svg+xml")
    );
    svgImages.forEach(img => {
  img.dataset.originalDisplay = img.style.display || "";
  img.style.display = "none";
});
inlineSvgs.forEach(svg => {
  svg.dataset.originalDisplay = svg.style.display || "";
  svg.style.display = "none";
});

bgWithSvg.forEach(el => {
  el.dataset.originalBackground = el.style.backgroundImage;
  el.style.backgroundImage = "none";
});

// Ocultar o reemplazar imágenes inline SVG
const svgDataImgs = contenedor.querySelectorAll("img[src^='data:image/svg+xml']");

svgDataImgs.forEach((img) => {
  const placeholder = document.createElement("div");
  placeholder.style.width = img.width + "px";
  placeholder.style.height = img.height + "px";
  placeholder.classList.add("svg-placeholder");
  img.parentNode.replaceChild(placeholder, img);
});

    const opciones = {
      margin: [5, 5, 15, 5],
      filename: "planillaMedicPAT1.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        scrollX: 0,
        useCORS: true,
        allowTaint: false,
        logging: true,
        imageTimeout: 5000
      },
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
  }, 1000); // Use a small delay to ensure DOM updates
  
  /* setTimeout(() => {
    // ⚠️ LIMPIEZA PRE-PDF (ANTES del .from)
    const svgImgs = contenedor.querySelectorAll("img[src^='data:image/svg+xml']");
    const inlineSvgs = contenedor.querySelectorAll("svg");
    const bgWithSvg = Array.from(contenedor.querySelectorAll("*")).filter(el =>
      el.style.backgroundImage && el.style.backgroundImage.includes("data:image/svg+xml")
    );
  
    // Guardamos lo original para restaurar luego
    svgImgs.forEach(img => {
      img.dataset.originalDisplay = img.style.display || "";
      img.style.display = "none";
    });
  
    inlineSvgs.forEach(svg => {
      svg.dataset.originalDisplay = svg.style.display || "";
      svg.style.display = "none";
    });
  
    bgWithSvg.forEach(el => {
      el.dataset.originalBackground = el.style.backgroundImage;
      el.style.backgroundImage = "none";
    });

    // Ocultar o reemplazar imágenes inline SVG
const svgDataImgs = contenedor.querySelectorAll("img[src^='data:image/svg+xml']");

svgDataImgs.forEach((img) => {
  const placeholder = document.createElement("div");
  placeholder.style.width = img.width + "px";
  placeholder.style.height = img.height + "px";
  placeholder.classList.add("svg-placeholder");
  img.parentNode.replaceChild(placeholder, img);
});


    const opciones = {
      margin: [5, 5, 15, 5],
      filename: "planillaMedicPAT1.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        scrollX: 0,
        useCORS: true,
        allowTaint: false,
        logging: true,
        imageTimeout: 5000
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
  
    // 🔥 Generación del PDF
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
        restaurarSvg(svgImgs, inlineSvgs, bgWithSvg);
        contenedor.classList.remove("pdf-export", "ocultar-botones");
        if (tabla) tabla.classList.remove("ocultar-eliminar");
        fechaDiv.remove();
        document.getElementById('loading-indicator').style.display = 'none';
      })
      .catch((err) => {
        restaurarSvg(svgImgs, inlineSvgs, bgWithSvg);
        console.error('Error al generar el PDF:', err);
        contenedor.classList.remove("pdf-export", "ocultar-botones");
        if (tabla) tabla.classList.remove("ocultar-eliminar");
        fechaDiv.remove();
        
        alert("Error al generar el PDF: " + err);
        document.getElementById('loading-indicator').style.display = 'none';
      });
  
  }, 1000); */
  
}; 