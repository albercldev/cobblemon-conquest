#!/bin/sh

# Set fail on error
set -e

# On failure, enable save-on to avoid data corruption
trap 'rcon-cli -a "$RCON_HOST" -p "$RCON_PASSWORD" "save-on"' EXIT

# Set autosave to false
rcon-cli -a "$RCON_HOST" -p "$RCON_PASSWORD" "save-off" "save-all"

# Wait for pending write operations to complete
sleep 10

# Generate tar file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SERVER_BACKUP_FILE="/backups/server_$TIMESTAMP.tar.gz"
DB_BACKUP_FILE="/backups/db_$TIMESTAMP.sql"
DB_BACKUP_FILE_COMPRESSED="/backups/db_$TIMESTAMP.tar.gz"

echo "Creating server backup..."
TOTAL_SIZE=$(du -sb /data | awk '{print $1}')
tar -c -C /data . | pv -f -s "$TOTAL_SIZE" -pterb | pigz > "$SERVER_BACKUP_FILE" 2>&1
# Set autosave back to true
rcon-cli -a "$RCON_HOST" -p "$RCON_PASSWORD" "save-on"

echo "Server backup created at $SERVER_BACKUP_FILE"

# Backup database
docker exec -t cobblemon-conquest-database pg_dump -U admin cobblemon_conquest > $DB_BACKUP_FILE
tar -czf "$DB_BACKUP_FILE_COMPRESSED" "$DB_BACKUP_FILE"
rm -f "$DB_BACKUP_FILE"
echo "Database backup created at $DB_BACKUP_FILE_COMPRESSED"

# back up all files in /backup to remote via scp
echo "Starting backups upload to ${SSH_USER}@${SSH_HOST}:${SSH_PATH}"
ssh-keyscan nas.albercl.dev >> /root/.ssh/known_hosts

echo "Uploading server backup ${SERVER_BACKUP_FILE} to ${SSH_USER}@${SSH_HOST}:${SSH_PATH}"
rsync -av --info=progress2 -e "ssh -i /root/.ssh/id" "$SERVER_BACKUP_FILE" "${SSH_USER}@${SSH_HOST}:${SSH_PATH}"

echo "Uploading database backup db_${TIMESTAMP}.tar.gz to ${SSH_USER}@${SSH_HOST}:${SSH_PATH}"
rsync -av --info=progress2 -e "ssh -i /root/.ssh/id" "$DB_BACKUP_FILE_COMPRESSED" "${SSH_USER}@${SSH_HOST}:${SSH_PATH}"

# Remove all files in /backups
echo "Cleaning up local backups"
rm -f /backups/*

echo "Backups upload complete."