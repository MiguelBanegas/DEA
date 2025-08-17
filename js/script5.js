document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos del DOM que vamos a necesitar
    const addRowBtn = document.getElementById('addRowBtn');
    const removeRowBtn = document.getElementById('removeRowBtn');
    const tableBody = document.querySelector('#protocolTable tbody');

    // Función para crear y añadir una nueva fila a la tabla
    const addNewRow = () => {
        const currentRowCount = tableBody.rows.length;
        const newRow = tableBody.insertRow(); // Crea un elemento <tr>

        // El número total de columnas en el cuerpo debe coincidir con el encabezado
        const totalColumns = 20;

        // Celda para el número de fila (no editable)
        const cellNumber = newRow.insertCell();
        cellNumber.textContent = currentRowCount + 1;

        // Añadimos el resto de las celdas, que sí serán editables
        // Empezamos en 1 porque ya creamos la primera celda
        for (let i = 1; i < totalColumns; i++) {
            const newCell = newRow.insertCell();
            newCell.setAttribute('contenteditable', 'true');
        }
    };

    // Función para eliminar la última fila de la tabla
    const removeLastRow = () => {
        const rowCount = tableBody.rows.length;
        if (rowCount > 0) {
            tableBody.deleteRow(rowCount - 1); // El índice de las filas empieza en 0
        } else {
            alert("No hay filas para eliminar.");
        }
    };

    // Asignamos las funciones a los eventos 'click' de los botones
    addRowBtn.addEventListener('click', addNewRow);
    removeRowBtn.addEventListener('click', removeLastRow);

    // Opcional: Crear una fila inicial al cargar la página
    addNewRow();
});