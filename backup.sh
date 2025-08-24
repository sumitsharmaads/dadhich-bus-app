#!/bin/bash

# Dadhich Bus App Backup Script
# Creates timestamped backups before deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/root/dadhich-bus-app"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}💾 Creating backup...${NC}"

cd "$PROJECT_DIR"

# Create backup directories
mkdir -p backups

# Backup frontend build
if [ -d "client/.next" ]; then
    echo -e "${GREEN}📦 Backing up frontend build...${NC}"
    tar -czf "backups/frontend_$TIMESTAMP.tar.gz" -C client .next
    echo -e "${GREEN}✅ Frontend backup created: frontend_$TIMESTAMP.tar.gz${NC}"
fi

# Backup backend build
if [ -d "server/dist" ]; then
    echo -e "${GREEN}📦 Backing up backend build...${NC}"
    tar -czf "backups/backend_$TIMESTAMP.tar.gz" -C server dist
    echo -e "${GREEN}✅ Backend backup created: backend_$TIMESTAMP.tar.gz${NC}"
fi

# Backup environment files
if [ -f "client/.env" ]; then
    cp "client/.env" "backups/frontend_env_$TIMESTAMP"
    echo -e "${GREEN}✅ Frontend env backup created${NC}"
fi

if [ -f "server/.env" ]; then
    cp "server/.env" "backups/backend_env_$TIMESTAMP"
    echo -e "${GREEN}✅ Backend env backup created${NC}"
fi

# Cleanup old backups (keep last 10)
echo -e "${BLUE}🧹 Cleaning up old backups...${NC}"
cd backups
ls -t *.tar.gz | tail -n +11 | xargs -r rm -f
ls -t frontend_env_* | tail -n +11 | xargs -r rm -f
ls -t backend_env_* | tail -n +11 | xargs -r rm -f

echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
echo -e "${BLUE}📁 Backup location: $PROJECT_DIR/backups/${NC}"
echo -e "${BLUE}📊 Available backups:${NC}"
ls -la backups/
