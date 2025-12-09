@echo off
cls
echo ========================================
echo   SCRIPT DEL OPERADOR - SISTEMA TIENDA
echo ========================================
echo.

:: Carpeta de logs
set LOGS=logs
if not exist %LOGS% mkdir %LOGS%

:: Fecha
set FECHA=%date:~-4%-%date:~3,2%-%date:~0,2%

echo [*] Generando registro de actividad...
echo --- LOG %FECHA% --- >> %LOGS%\estado-%FECHA%.log

:: 1) Comprobar conexión a Internet
echo [*] Verificando conexión a Internet...
ping google.com -n 1 >nul
if errorlevel 1 (
    echo [X] Sin conexión >> %LOGS%\estado-%FECHA%.log
    echo   ✗ No hay Internet.
) else (
    echo [OK] Conectado >> %LOGS%\estado-%FECHA%.log
    echo   ✓ Internet OK.
)

:: 2) Comprobar si el servidor web responde
echo [*] Verificando estado del servidor...
curl -s -I http://localhost >nul

if errorlevel 1 (
    echo [X] Servidor caído >> %LOGS%\estado-%FECHA%.log
    echo   ✗ El servidor NO responde.
) else (
    echo [OK] Servidor activo >> %LOGS%\estado-%FECHA%.log
    echo   ✓ El servidor está funcionando.
)

:: 3) Verificar espacio en disco
echo [*] Revisando espacio en disco...
wmic logicaldisk get size,freespace,caption > %LOGS%\disco-%FECHA%.log
echo   ✓ Estado de disco guardado.

:: 4) Backup de base de datos (MYSQL)
echo [*] Creando backup de la base de datos...
set BACKUP=backups
if not exist %BACKUP% mkdir %BACKUP%

:: Cambia estos datos si querés hacerlo real
set USER=root
set PASS=""
set DB=mitiendadecompra

mysqldump -u %USER% -p%PASS% %DB% > %BACKUP%\backup-%FECHA%.sql

if errorlevel 1 (
    echo [X] Error al hacer backup >> %LOGS%\estado-%FECHA%.log
    echo   ✗ Backup falló.
) else (
    echo [OK] Backup creado >> %LOGS%\estado-%FECHA%.log
    echo   ✓ Backup listo.
)

echo.
echo ========================================
echo PROCESO FINALIZADO
echo Los reportes están en la carpeta /logs
echo Los backups en /backups
echo ========================================
pause
