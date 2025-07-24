@echo off
REM Inicia el servidor Mongoose en el puerto 8080
start "" mongoose.exe

REM Espera 2 segundos para que el servidor arranque
timeout /t 2 >nul

REM Abre la página en el navegador predeterminado
start "" http://localhost:8000/verificacion.html

REM Mantiene la ventana abierta para ver mensajes (opcional)
REM pause