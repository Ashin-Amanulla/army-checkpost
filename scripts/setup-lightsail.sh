#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /home/bitnami/apps
sudo chown -R bitnami:bitnami /home/bitnami/apps

# Install Nginx
sudo apt-get install -y nginx

# Configure Nginx
sudo tee /etc/nginx/sites-available/default << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /home/bitnami/apps/frontend;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo systemctl restart nginx 