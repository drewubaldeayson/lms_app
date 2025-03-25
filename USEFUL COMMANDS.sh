# 1. SSH into your droplet
ssh root@your-droplet-ip

# 2. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Create app directory
mkdir -p /var/www/knowledge-base
cd /var/www/knowledge-base

# 4. Clone your repository
git clone your-repository-url .

# 5. Create production environment file
cat > .env << EOL
JWT_SECRET=your-secure-jwt-secret
MONGO_USER=admin
MONGO_PASSWORD=your-secure-password
EOL

# 6. Create backup directory
mkdir -p /var/backups/knowledge-base

# 7. Start the application
docker-compose up -d --build





USEFUL COMMANDS


# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Update application
git pull
docker-compose up -d --build

# Check status
docker-compose ps

# Stop application
docker-compose down

# View resource usage
docker stats


BASH

# /var/www/knowledge-base/update.sh
#!/bin/bash

echo "Starting update process..."

# Pull latest changes
git pull

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build

echo "Update completed!"



# Set up UFW firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Install and configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban


docker-compose -f docker-compose.dev.yml exec backend node scripts/createDefaultUser.js