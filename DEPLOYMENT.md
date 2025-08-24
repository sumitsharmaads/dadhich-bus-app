# 🚀 CI/CD Pipeline Setup Guide

This guide will help you set up automatic deployment to your VPS whenever you merge code to the main branch.

## 📋 Prerequisites

- GitHub repository with your code
- VPS with SSH access
- PM2 installed on VPS
- Node.js and npm on VPS

## 🔧 Setup Steps

### 1. Generate SSH Key for GitHub Actions

On your VPS, generate a new SSH key specifically for GitHub Actions:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "github-actions@dadhichbusservice.com" -f ~/.ssh/github_actions

# Copy public key to authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub
chmod 700 ~/.ssh
```

### 2. Add SSH Key to GitHub

Copy the **private** key content:

```bash
cat ~/.ssh/github_actions
```

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret:

- **Name**: `VPS_SSH_KEY`
- **Value**: Paste the entire private key content (including `-----BEGIN OPENSSH PRIVATE KEY-----`)

### 3. Add Other GitHub Secrets

Add these additional secrets:

- **Name**: `VPS_HOST`
- **Value**: Your VPS IP address (e.g., `31.97.237.253`)

- **Name**: `VPS_USERNAME`
- **Value**: `root`

- **Name**: `VPS_PORT`
- **Value**: `22`

### 4. Make Scripts Executable

On your VPS, make the deployment scripts executable:

```bash
cd /root/dadhich-bus-app
chmod +x deploy.sh rollback.sh
```

### 5. Test Manual Deployment

Test the deployment script manually first:

```bash
./deploy.sh
```

## 🔄 How It Works

### Automatic Deployment Flow

1. **Code Push**: You push code to `main` branch
2. **GitHub Actions**: Automatically triggers the workflow
3. **Build & Test**: Builds both frontend and backend
4. **SSH Deploy**: Connects to your VPS via SSH
5. **Update Code**: Pulls latest changes from GitHub
6. **Install Dependencies**: Installs new npm packages
7. **Build**: Builds the frontend
8. **Restart Services**: Restarts PM2 processes
9. **Health Check**: Verifies services are running

### Manual Deployment

You can also deploy manually anytime:

```bash
# On your VPS
cd /root/dadhich-bus-app
./deploy.sh
```

### Emergency Rollback

If something goes wrong, quickly rollback:

```bash
# On your VPS
cd /root/dadhich-bus-app
./rollback.sh
```

## 📊 Monitoring

### Check Deployment Status

```bash
# View PM2 status
pm2 status

# View PM2 logs
pm2 logs

# View specific service logs
pm2 logs frontend
pm2 logs backend
```

### Check Service Health

```bash
# Frontend health check
curl -I http://localhost:3000

# Backend health check
curl -I http://localhost:5000/health
```

## 🛠️ Customization

### Environment-Specific Deployments

You can modify the workflow to handle different environments:

- **Staging**: Deploy to a staging VPS
- **Production**: Deploy to production VPS
- **Preview**: Deploy preview builds for PRs

### Notification Integration

Add notifications to Slack, Discord, or email:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔒 Security Best Practices

1. **SSH Key Rotation**: Regularly rotate the SSH key
2. **Limited Access**: Use a dedicated user with minimal permissions
3. **Firewall**: Only allow SSH from GitHub Actions IPs
4. **Monitoring**: Monitor deployment logs for suspicious activity

## 🚨 Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Check SSH key permissions
   - Verify VPS firewall settings
   - Ensure GitHub secrets are correct

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for TypeScript compilation errors

3. **Service Won't Start**
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check port availability

### Debug Mode

Enable debug logging in the deployment script:

```bash
# Add this to deploy.sh
set -x  # Enable debug mode
```

## 📈 Advanced Features

### Blue-Green Deployment

For zero-downtime deployments, implement blue-green deployment:

1. Deploy to new instance
2. Run health checks
3. Switch traffic
4. Remove old instance

### Database Migrations

Add database migration handling:

```bash
# In deploy.sh
if [ -f "server/migrations/run.sh" ]; then
    cd server
    ./migrations/run.sh
fi
```

### Backup Before Deploy

Always backup before deployment:

```bash
# In deploy.sh
./backup.sh  # Create your backup script
```

## 🎯 Next Steps

1. **Set up monitoring**: Add UptimeRobot or similar
2. **Log aggregation**: Use ELK stack or similar
3. **Performance monitoring**: Add New Relic or similar
4. **Security scanning**: Integrate with Snyk or similar

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Review VPS deployment logs
3. Verify all secrets are set correctly
4. Test manual deployment first

---

**Happy Deploying! 🚀**
