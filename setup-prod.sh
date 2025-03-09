# setup-prod.sh
#!/bin/bash

echo "Starting production setup..."

# Update necessary directories with correct permissions
chmod -R 755 backend/markdown-files

# Create production environment file if it doesn't exist
if [ ! -f .env ]; then
  cat > .env << EOL
JWT_SECRET=jasodifjasoifjoajfodajfosidjfoiasdjfosaidfjosaifjiasof
MONGO_USER=admin
MONGO_PASSWORD=admin
EOL
  echo "Created .env file. Please update with secure values."
fi

# Start MongoDB first
docker-compose up -d mongodb

echo "Waiting for MongoDB to start..."
sleep 10

# Create initial admin user
echo "Creating initial admin user..."
docker-compose exec -T backend node scripts/createDefaultUser.js

# Start remaining services
echo "Starting all services..."
docker-compose up -d --build

echo "Production setup completed!"
