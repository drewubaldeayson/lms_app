#!/bin/bash
# setup-dev.sh

echo "Setting up development environment..."

# Install frontend dependencies
cd frontend
npm install
echo "Frontend dependencies installed"

# Install backend dependencies
cd ../backend
npm install
echo "Backend dependencies installed"

# Start development servers
echo "Starting development servers..."
cd ../frontend
npm start &
cd ../backend
npm run dev &

echo "Development environment setup complete!"