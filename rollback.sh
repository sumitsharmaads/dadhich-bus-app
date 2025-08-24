#!/bin/bash

# Dadhich Bus App Rollback Script
# Use this script to quickly rollback to a previous deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/root/dadhich-bus-app"
PM2_FRONTEND="frontend"
PM2_BACKEND="backend"

echo -e "${BLUE}🔄 Starting rollback process...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

cd "$PROJECT_DIR"

# Check available backups
echo -e "${BLUE}📦 Available backups:${NC}"
echo "Frontend backups:"
ls -la client/.next.backup* 2>/dev/null || echo "No frontend backups found"
echo ""
echo "Backend backups:"
ls -la server/dist.backup* 2>/dev/null || echo "No backend backups found"
echo ""

# Ask user which backup to restore
read -p "Enter backup timestamp to restore (e.g., .next.backup.20241224_143022): " BACKUP_TIMESTAMP

if [ -z "$BACKUP_TIMESTAMP" ]; then
    print_error "No backup timestamp provided"
    exit 1
fi

# Check if backup exists
if [ ! -d "client/$BACKUP_TIMESTAMP" ] && [ ! -d "server/$BACKUP_TIMESTAMP" ]; then
    print_error "Backup not found: $BACKUP_TIMESTAMP"
    exit 1
fi

print_status "Rolling back to backup: $BACKUP_TIMESTAMP"

# Stop services
print_status "Stopping services..."
pm2 stop $PM2_FRONTEND $PM2_BACKEND

# Restore frontend
if [ -d "client/$BACKUP_TIMESTAMP" ]; then
    print_status "Restoring frontend..."
    rm -rf client/.next
    cp -r "client/$BACKUP_TIMESTAMP" client/.next
    print_status "Frontend restored"
fi

# Restore backend
if [ -d "server/$BACKUP_TIMESTAMP" ]; then
    print_status "Restoring backend..."
    rm -rf server/dist
    cp -r "server/$BACKUP_TIMESTAMP" server/dist
    print_status "Backend restored"
fi

# Start services
print_status "Starting services..."
pm2 start $PM2_FRONTEND
pm2 start $PM2_BACKEND

# Wait for services to start
sleep 5

# Check service status
print_status "Checking service status..."
pm2 status

# Health checks
print_status "Performing health checks..."

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    print_status "Frontend is running (HTTP $FRONTEND_STATUS)"
else
    print_warning "Frontend health check failed (HTTP $FRONTEND_STATUS)"
fi

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "000")
if [ "$BACKEND_STATUS" = "200" ]; then
    print_status "Backend is running (HTTP $BACKEND_STATUS)"
else
    print_warning "Backend health check failed (HTTP $BACKEND_STATUS)"
fi

echo ""
echo -e "${GREEN}🎉 Rollback completed successfully!${NC}"
echo -e "${BLUE}📊 Service Status:${NC}"
pm2 list --no-daemon | grep -E "(frontend|backend)"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "Frontend: ${GREEN}https://dadhichbusservice.com${NC}"
echo -e "Backend:  ${GREEN}https://api.dadhichbusservice.com${NC}"
