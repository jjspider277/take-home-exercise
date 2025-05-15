#!/bin/bash

# Make the script executable with: chmod +x start.sh

echo "Starting Customer Persona Experience App..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f ./customer-persona-api/.env ]; then
    echo "Creating API environment file..."
    cp ./customer-persona-api/.env.example ./customer-persona-api/.env
fi

if [ ! -f ./customer-persona-app/.env ]; then
    echo "Creating frontend environment file..."
    cp ./customer-persona-app/.env.example ./customer-persona-app/.env
fi

# Build and start the containers
echo "Building and starting containers..."
docker compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check if services are running
if docker compose ps | grep -q "customer-persona-api"; then
    echo "API is running at: http://localhost:3001"
    echo "API Documentation: http://localhost:3001/api"
else
    echo "Error: API failed to start."
fi

if docker compose ps | grep -q "customer-persona-app"; then
    echo "Frontend is running at: http://localhost:3000"
else
    echo "Error: Frontend failed to start."
fi

echo ""
echo "To view logs, run: docker-compose logs -f"
echo "To stop the application, run: docker-compose down"
echo ""
echo "Customer Persona Experience App is now ready!"