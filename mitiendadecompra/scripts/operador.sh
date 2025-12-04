#!/bin/bash
# operador.sh - script básico de operación
BACKUP_DIR="/var/backups/mitiendadecompra"
DATE=$(date +%F_%H%M)
mkdir -p "$BACKUP_DIR"

echo "Parando servicios web..."
# service apache2 stop   # comentado si en Windows/XAMPP
# service mysql stop

echo "Haciendo backup de la base de datos..."
mysqldump -u root --databases mitiendadecompra > "$BACKUP_DIR/mitiendadecompra_$DATE.sql"

echo "Revisando espacio en disco..."
df -h

echo "Rotando logs (ejemplo)..."
# ejemplo simple
LOG_DIR="/var/log/mitienda"
mkdir -p "$LOG_DIR"
# find $LOG_DIR -type f -mtime +30 -delete

echo "Arrancando servicios web..."
# service mysql start
# service apache2 start

echo "Operación finalizada: $(date)"
