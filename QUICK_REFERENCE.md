# 🚀 Quick Reference Card - VPS Management

## 📱 **Daily Commands**

### Check Status
```bash
pm2 status                    # Check app status
pm2 logs --lines 20          # View recent logs
systemctl status nginx       # Check Nginx
nginx -t                     # Test Nginx config
```

### Restart Services
```bash
pm2 restart frontend         # Restart frontend
pm2 restart backend          # Restart backend
systemctl reload nginx       # Reload Nginx
```

---

## 🔄 **Deployment Commands**

### Manual Deployment
```bash
cd /root/dadhich-bus-app
git pull origin main

# Frontend
cd client && npm ci && npm run build
pm2 restart frontend

# Backend
cd ../server && npm ci && npm run build  
pm2 restart backend
```

### CI/CD (Automatic)
```bash
# Just push to main branch!
git push origin main
# GitHub Actions will handle everything automatically
```

---

## 🛠️ **Troubleshooting**

### Check Logs
```bash
pm2 logs frontend            # Frontend logs
pm2 logs backend             # Backend logs
pm2 logs --lines 100         # Last 100 lines
```

### Check Ports
```bash
netstat -tulpn | grep :3000  # Frontend port
netstat -tulpn | grep :5000  # Backend port
```

### Kill Processes
```bash
kill -9 PROCESS_ID           # Kill specific process
pm2 delete frontend          # Remove from PM2
pm2 delete backend           # Remove from PM2
```

---

## 📁 **Important File Locations**

| File | Location |
|------|----------|
| **Frontend .env** | `/root/dadhich-bus-app/client/.env` |
| **Backend .env** | `/root/dadhich-bus-app/server/.env` |
| **Nginx Config** | `/etc/nginx/sites-available/dadhichbusservice` |
| **SSL Certs** | `/etc/letsencrypt/` |
| **PM2 Logs** | `~/.pm2/logs/` |

---

## 🌐 **Your URLs**

- **Frontend**: `https://dadhichbusservice.com`
- **Backend API**: `https://api.dadhichbusservice.com`
- **Local Frontend**: `http://localhost:3000`
- **Local Backend**: `http://localhost:5000`

---

## 🔑 **Environment Variables**

### Frontend (`client/.env`)
```env
NEXT_PUBLIC_SITE_URL=https://dadhichbusservice.com
NEXT_PUBLIC_API_URL=https://api.dadhichbusservice.com/api
```

### Backend (`server/.env`)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CORS_ORIGIN=https://dadhichbusservice.com
```

---

## 🚨 **Emergency Commands**

### If Everything Breaks
```bash
# Stop all services
pm2 stop all
systemctl stop nginx

# Start fresh
pm2 start all
systemctl start nginx

# Check status
pm2 status
systemctl status nginx
```

### Rollback to Previous Version
```bash
cd /root/dadhich-bus-app
git log --oneline -5          # See recent commits
git reset --hard COMMIT_HASH  # Rollback to specific commit
pm2 restart all               # Restart services
```

---

## 📊 **System Monitoring**

```bash
htop                         # System resources
df -h                        # Disk usage
free -h                      # Memory usage
top                          # Process list
```

---

## 🔒 **SSL Management**

```bash
certbot certificates          # Check cert status
certbot renew --dry-run      # Test renewal
certbot renew                # Manual renewal
```

---

## 📝 **Quick Notes**

- **Always backup before major changes**
- **Test Nginx config before reloading**
- **Check PM2 logs for errors**
- **Keep SSH keys secure**
- **Monitor disk space regularly**

---

**💡 Pro Tip**: Bookmark this file and the main `DEPLOYMENT_COMPLETE_GUIDE.md` for quick access!

**🚀 Happy Deploying!**
