#!/bin/bash

# Dadhich Bus App Deployment Script
# This script automates the deployment process on your VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/dadhich-bus-app"
BRANCH="main"
PM2_FRONTEND="frontend"
PM2_BACKEND="backend"

echo -e "${BLUE}🚀 Starting deployment process...${NC}"

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

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Backup current state
print_status "Creating backup of current state..."
cp -r client/.next client/.next.backup 2>/dev/null || true
cp -r server/dist server/dist.backup 2>/dev/null || true

# Git operations
print_status "Pulling latest changes from $BRANCH branch..."
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

# Check if there are actual changes
if git diff --quiet HEAD~1 HEAD; then
    print_warning "No changes detected, skipping deployment"
    exit 0
fi

# Frontend deployment
print_status "Deploying frontend..."
cd client

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Build frontend
print_status "Building frontend..."
npm run build

# Backend deployment
print_status "Deploying backend..."
cd ../server

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Build backend (if build script exists)
if npm run | grep -q "build"; then
    print_status "Building backend..."
    npm run build
fi

# Restart services
print_status "Restarting services..."
cd ..

# Restart frontend
print_status "Restarting frontend service..."
pm2 restart $PM2_FRONTEND

# Restart backend
print_status "Restarting backend service..."
pm2 restart $PM2_BACKEND

# Wait a moment for services to start
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

# Cleanup old backups (keep last 3)
print_status "Cleaning up old backups..."
cd client
ls -dt .next.backup* | tail -n +4 | xargs -r rm -rf
cd ../server
ls -dt dist.backup* | tail -n +4 | xargs -r rm -rf

# Deployment summary
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📊 Service Status:${NC}"
pm2 list --no-daemon | grep -E "(frontend|backend)"
echo ""
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "Frontend: ${GREEN}https://dadhichbusservice.com${NC}"
echo -e "Backend:  ${GREEN}https://api.dadhichbusservice.com${NC}"
echo ""
echo -e "${BLUE}📝 Recent commits:${NC}"
git log --oneline -5
echo ""
echo -e "${GREEN}✅ Deployment process completed!${NC}"
