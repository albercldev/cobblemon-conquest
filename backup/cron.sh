#!/bin/sh

cd /var/docker/cobblemon-conquest
docker compose up --no-start backup
docker compose start backup