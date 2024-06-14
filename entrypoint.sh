#!/bin/bash

# Function to log messages with a prefix
log() {
  echo "[SCRIPT] $1"
}
set -e

log "Build Process..."
npm run build

sleep 10
yarn prisma:push

log "Starting development environment..."
yarn start
