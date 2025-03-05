#!/bin/bash
# deploy.sh

# Frontend build
cd frontend
npm install
npm run build:prod

# Copy frontend build to backend public directory
cp -r build/* ../backend/public/

# Backend deployment
cd ../backend
npm install
NODE_ENV=production npm start