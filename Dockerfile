# Use Nginx as the web server
FROM nginx:alpine

# Copy website files to Nginx html folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

