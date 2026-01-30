#!/bin/sh

cd /var/docker/cobblemon-bw
docker compose up --no-start backup
docker compose start backup