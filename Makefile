.PHONY: build up down logs ps clean

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start all services with logs
start:
	docker-compose up

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Check running containers
ps:
	docker-compose ps

# Clean up volumes and containers
clean:
	docker-compose down -v
	docker system prune -f

# Initialize database (run migrations)
init-db:
	docker-compose exec api npm run typeorm migration:run

# Enter bash shell in api container
api-shell:
	docker-compose exec api sh

# Enter bash shell in frontend container
frontend-shell:
	docker-compose exec frontend sh

# Enter psql shell in database container
db-shell:
	docker-compose exec postgres psql -U postgres -d customer_persona