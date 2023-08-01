# Nginx config

server {
    listen 80;
    server_name salon.bestoerp.com;

    location / {
        root /var/www/salon;
        index index.html;
    }
}

server {
    listen 80;
    server_name bestojewel.bestoerp.com;

    location / {
        root /var/www/bestojewel;
        index index.html;
    }
}
