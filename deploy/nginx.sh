#!/bin/bash

# Install nginx
echo "Installing nginx..."
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Copy nginx config
echo "Copying nginx config..."
sudo cp bestoerp.com /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/bestoerp.com /etc/nginx/sites-enabled/

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx