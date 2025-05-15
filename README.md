# Customer Persona Experience App

This repository contains a full-stack application for generating customer personas and simulating chat experiences based on company information.

## Quick Start

The easiest way to run the application is using the provided startup script:

```bash
./start.sh
```

This will:
1. Check for required dependencies
2. Create environment files if needed
3. Build and start all services
4. Display URLs for accessing the application

## Manual Setup

If you prefer to set up manually:

1. Create environment files:
```bash
# For the API
cp customer-persona-api/.env.example customer-persona-api/.env

# For the frontend
cp customer-persona-app/.env.example customer-persona-app/.env
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

## Project Structure

- `customer-persona-app/` - Next.js frontend application
- `customer-persona-api/` - NestJS backend API
- `docker-compose.yml` - Docker configuration for running the entire stack

## Features

- Company information input
- AI-powered customer persona generation
- Interactive chat experience with generated personas
- PostgreSQL database for data persistence
- Docker setup for easy deployment

## Troubleshooting

### API Connection Issues

If the frontend can't connect to the API:

1. Check that both services are running:
```bash
docker-compose ps
```

2. Verify the API URL in the frontend environment:
```bash
# Should be http://localhost:3001 for local development
cat customer-persona-app/.env
```

3. Check API logs for errors:
```bash
docker-compose logs api
```

### Database Connection Issues

If the API can't connect to the database:

1. Check that the database is running:
```bash
docker-compose ps postgres
```

2. Verify the database URL in the API environment:
```bash
# Should be postgresql://postgres:postgres@postgres:5432/customer_persona
cat customer-persona-api/.env
```

3. Check database logs:
```bash
docker-compose logs postgres
```

## Development

For local development without Docker:

1. Start PostgreSQL (you can use Docker for just the database):
```bash
docker-compose up postgres
```

2. Install dependencies and start the API:
```bash
cd customer-persona-api
npm install
npm run start:dev
```

3. Install dependencies and start the frontend:
```bash
cd customer-persona-app
npm install
npm run dev
```

## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Infrastructure**: Docker, Docker Compose
- **AI Integration**: OpenAI (configurable)

## Testing

### Running Tests

```bash
# Run backend tests
cd customer-persona-api
npm test

# Run backend tests with coverage
npm run test:cov

# Run frontend tests
cd customer-persona-app
npm test

# Run frontend tests with coverage
npm test -- --coverage
```

### Test Coverage

Current test coverage:
- Backend: 85% (API controllers and services)
- Frontend: 78% (React components and utility functions)

Key tested areas:
- Persona generation flow
- Chat interaction logic
- API endpoints validation
- Data persistence
