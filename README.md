# Project Setup

## Development Mode

```
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Remove any existing node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Start again
docker-compose -f docker-compose.dev.yml up -d --build

npm run dev:up       # Start the development environment
npm run dev:logs     # Check the logs
```

## Production Mode


```
chmod +x setup-prod.sh
npm run setup:prod
```

## Additional Commands

#### Rebuild and restart containers
docker-compose down
docker-compose up -d --build