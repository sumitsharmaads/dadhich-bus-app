# 🚀 Complete Deployment Guide: Hostinger VPS + GoDaddy Domain

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [VPS Setup](#vps-setup)
3. [Domain Configuration](#domain-configuration)
4. [Application Deployment](#application-deployment)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Certificates](#ssl-certificates)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance Commands](#maintenance-commands)

---

## 🔑 Prerequisites

### What You Need:
- ✅ Hostinger VPS (Ubuntu 22.04 LTS)
- ✅ GoDaddy domain (`dadhichbusservice.com`)
- ✅ GitHub repository with SSH access
- ✅ MongoDB Atlas connection string
- ✅ Cloudinary credentials

---

## 🖥️ VPS Setup

### Step 1: Access Your VPS
```bash
# SSH into your VPS (replace with your actual IP)
ssh root@YOUR_VPS_IP
```

### Step 2: Update System & Install Dependencies
```bash
# Update system packages
apt update && apt upgrade -y

# Install essential packages
apt install -y curl git nginx ufw

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Verify installations
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x or higher
pm2 --version     # Should show 6.x.x
nginx -v          # Should show nginx version
```

### Step 3: Configure Firewall
```bash
# Enable UFW
ufw enable

# Allow SSH (important!)
ufw allow ssh

# Allow HTTP and HTTPS
ufw allow 80
ufw allow 443

# Allow your application ports
ufw allow 3000  # Frontend
ufw allow 5000  # Backend

# Check status
ufw status
```

---

## 🌐 Domain Configuration

### Step 1: GoDaddy DNS Setup
1. **Login to GoDaddy** → Go to Domain Management
2. **Select your domain** → Click "DNS"
3. **Add/Update Records:**

#### A Records:
```
Type: A
Name: @
Value: YOUR_VPS_IP
TTL: 600

Type: A  
Name: api
Value: YOUR_VPS_IP
TTL: 600
```

#### CNAME Records (Optional):
```
Type: CNAME
Name: www
Value: @
TTL: 600
```

### Step 2: Wait for DNS Propagation
- **DNS changes take 5-60 minutes** to propagate globally
- Use [whatsmydns.net](https://whatsmydns.net) to check propagation status

---

## 📱 Application Deployment

### Step 1: Clone Repository
```bash
# Navigate to root
cd /root

# Clone your repository (use SSH URL)
git clone git@github.com:sumitsharmaads/dadhich-bus-app.git

# Navigate to project
cd dadhich-bus-app
```

### Step 2: Setup Environment Files

#### Frontend Environment (`client/.env`):
```bash
# Create frontend .env
nano client/.env
```

**Content:**
```env
NEXT_PUBLIC_SITE_URL=https://dadhichbusservice.com
NEXT_PUBLIC_API_URL=https://api.dadhichbusservice.com/api
```

#### Backend Environment (`server/.env`):
```bash
# Create backend .env
nano server/.env
```

**Content:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://dadhichbusservice.com
```

### Step 3: Install Dependencies & Build
```bash
# Frontend setup
cd client
npm ci
npm run build

# Backend setup
cd ../server
npm ci
npm run build

# Return to root
cd ..
```

### Step 4: Start Applications with PM2
```bash
# Start frontend
cd client
pm2 start npm --name "frontend" -- start

# Start backend
cd ../server
pm2 start npm --name "backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Check status
pm2 status
```

---

## 🔧 Nginx Configuration

### Step 1: Create Nginx Site Configuration
```bash
# Create site configuration
nano /etc/nginx/sites-available/dadhichbusservice
```

**Content:**
```nginx
# Frontend server block
server {
    listen 80;
    server_name dadhichbusservice.com www.dadhichbusservice.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API server block
server {
    listen 80;
    server_name api.dadhichbusservice.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 2: Enable Site & Test Configuration
```bash
# Enable site
ln -s /etc/nginx/sites-available/dadhichbusservice /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## 🔒 SSL Certificates

### Step 1: Install Certbot
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificates
certbot --nginx -d dadhichbusservice.com -d www.dadhichbusservice.com -d api.dadhichbusservice.com

# Follow prompts:
# - Enter your email
# - Agree to terms (Y)
# - Share email with EFF (N)
# - Redirect HTTP to HTTPS (2)
```

### Step 2: Auto-renewal Setup
```bash
# Test auto-renewal
certbot renew --dry-run

# Check renewal status
crontab -l
```

---

## 🔄 CI/CD Pipeline

### Step 1: GitHub Actions Setup

#### Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd client && npm ci
        cd ../server && npm ci
        
    - name: Build applications
      run: |
        cd client && npm run build
        cd ../server && npm run build
        
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USERNAME }}
        key: ${{ secrets.VPS_SSH_KEY }}
        port: ${{ secrets.VPS_PORT }}
        script: |
          cd /root/dadhich-bus-app
          git pull origin main
          
          # Frontend deployment
          echo "🚀 Deploying frontend..."
          cd client
          npm ci
          npm run build
          
          # Backend deployment
          echo "🚀 Deploying backend..."
          cd ../server
          npm ci
          npm run build
          
          # Restart services
          echo "🔄 Restarting services..."
          pm2 restart frontend
          pm2 restart backend
          
          # Wait and check status
          sleep 5
          pm2 status
          echo "🚀 Deployment completed successfully!"
```

### Step 2: GitHub Secrets Setup
1. **Go to your GitHub repository** → Settings → Secrets and variables → Actions
2. **Add these secrets:**
   - `VPS_HOST`: Your VPS IP address
   - `VPS_USERNAME`: `root`
   - `VPS_SSH_KEY`: Your VPS private SSH key
   - `VPS_PORT`: `22` (or your custom SSH port)

### Step 3: SSH Key Setup on VPS
```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -C "deployment@vps"

# Copy public key to GitHub
cat ~/.ssh/id_ed25519.pub

# Start SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

---

## ⚙️ Environment Variables

### Frontend Variables (`client/.env`):
```env
NEXT_PUBLIC_SITE_URL=https://dadhichbusservice.com
NEXT_PUBLIC_API_URL=https://api.dadhichbusservice.com/api
```

### Backend Variables (`server/.env`):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=https://dadhichbusservice.com
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions:

#### 1. PM2 Services Not Starting
```bash
# Check logs
pm2 logs frontend
pm2 logs backend

# Restart services
pm2 restart frontend
pm2 restart backend

# Check status
pm2 status
```

#### 2. Nginx Configuration Errors
```bash
# Test configuration
nginx -t

# Check Nginx status
systemctl status nginx

# Reload Nginx
systemctl reload nginx
```

#### 3. Port Already in Use
```bash
# Check what's using ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Kill processes if needed
kill -9 PROCESS_ID
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Renew manually
certbot renew

# Check auto-renewal
crontab -l
```

#### 5. Git Authentication Issues
```bash
# Test GitHub connection
ssh -T git@github.com

# If permission denied, regenerate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub SSH keys
```

---

## 🛠️ Maintenance Commands

### Daily Operations:
```bash
# Check service status
pm2 status
pm2 logs --lines 50

# Check system resources
htop
df -h
free -h

# Check Nginx status
systemctl status nginx
nginx -t
```

### Deployment Commands:
```bash
# Manual deployment
cd /root/dadhich-bus-app
git pull origin main

# Frontend
cd client && npm ci && npm run build
pm2 restart frontend

# Backend  
cd ../server && npm ci && npm run build
pm2 restart backend
```

### Backup & Rollback:
```bash
# Create backup
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz client/.next server/dist

# Restore from backup
tar -xzf backup-FILENAME.tar.gz
pm2 restart frontend
pm2 restart backend
```

---

## 📚 Quick Reference Commands

### Essential Commands:
```bash
# Service management
pm2 start/stop/restart frontend/backend
pm2 status
pm2 logs

# Nginx
nginx -t
systemctl reload nginx
systemctl status nginx

# SSL
certbot renew --dry-run
certbot certificates

# Git
git pull origin main
git status
git log --oneline -5
```

### File Locations:
- **Nginx config**: `/etc/nginx/sites-available/dadhichbusservice`
- **Environment files**: `/root/dadhich-bus-app/client/.env`, `/root/dadhich-bus-app/server/.env`
- **Application logs**: `~/.pm2/logs/`
- **SSL certificates**: `/etc/letsencrypt/`

---

## 🎯 Success Checklist

- ✅ VPS accessible via SSH
- ✅ Node.js, npm, PM2 installed
- ✅ Firewall configured (ports 22, 80, 443, 3000, 5000)
- ✅ Repository cloned
- ✅ Environment variables set
- ✅ Applications built and running with PM2
- ✅ Nginx configured and running
- ✅ SSL certificates installed
- ✅ DNS propagated
- ✅ CI/CD pipeline working
- ✅ Frontend accessible at `https://dadhichbusservice.com`
- ✅ Backend accessible at `https://api.dadhichbusservice.com`

---

## 🆘 Emergency Contacts

- **VPS Provider**: Hostinger Support
- **Domain Provider**: GoDaddy Support  
- **SSL Provider**: Let's Encrypt Community
- **GitHub**: GitHub Support

---

## 📝 Notes

- **Always backup before major changes**
- **Test configurations before applying**
- **Keep SSH keys secure**
- **Monitor logs regularly**
- **Update system packages monthly**
- **Renew SSL certificates automatically**

---

**🎉 Congratulations! You now have a complete, production-ready deployment setup!**

**Next time you need to deploy, just push to main branch and GitHub Actions will handle everything automatically!** 🚀
