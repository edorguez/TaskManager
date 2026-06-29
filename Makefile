# ─── TaskManager Makefile ───────────────────────────────────────────
#   Commands for backend (.NET), frontend (React), Docker, and EF Core
# ─────────────────────────────────────────────────────────────────────

.SILENT:
.ONESHELL:

# ─── Variables ─────────────────────────────────────────────────────

SOLUTION        = TaskManager.slnx
API_PROJECT     = src/TaskManager.API
INFRA_PROJECT   = src/TaskManager.Infrastructure
TEST_PROJECT    = src/TaskManager.Tests
FRONTEND_DIR    = frontend/taskmanager-web
DOCKER_COMPOSE  = docker compose

# ─── Dotnet Commands ───────────────────────────────────────────────

.PHONY: restore
restore: ## Restore NuGet packages for the solution
	dotnet restore $(SOLUTION)

.PHONY: build
build: ## Build the entire .NET solution
	dotnet build $(SOLUTION) --no-restore

.PHONY: rebuild
rebuild: clean ## Clean and rebuild the entire .NET solution
	dotnet build $(SOLUTION)

.PHONY: test
test: ## Run all unit tests with verbose output
	dotnet test $(TEST_PROJECT) --verbosity normal

.PHONY: test-coverage
test-coverage: ## Run tests with code coverage report
	dotnet test $(TEST_PROJECT) --verbosity normal -p:CollectCoverage=true -p:CoverletOutputFormat=opencover

.PHONY: run-api
run-api: ## Start the API server (http://localhost:5000)
	dotnet run --project $(API_PROJECT)

.PHONY: watch-api
watch-api: ## Start the API server with hot reload
	dotnet watch run --project $(API_PROJECT)

.PHONY: clean
clean: ## Clean all .NET build artifacts (bin/obj)
	dotnet clean $(SOLUTION)
	find . -type d \( -name bin -o -name obj \) -prune -exec rm -rf {} \; 2>/dev/null || true

.PHONY: publish
publish: ## Publish the API project for production
	dotnet publish $(API_PROJECT) -c Release -o ./publish/api

# ─── EF Core Migrations ────────────────────────────────────────────
#   Note: Requires `dotnet ef` tool and the Design package.
#   Install: dotnet tool install --global dotnet-ef
#   Or update to a version compatible with .NET 10.
# ───────────────────────────────────────────────────────────────────

.PHONY: migration-add
migration-add: ## Scaffold a new migration: make migration-add name=<migration_name>
ifndef name
	$(error Usage: make migration-add name=<migration_name>)
endif
	dotnet ef migrations add $(name) --project $(INFRA_PROJECT) --startup-project $(API_PROJECT)

.PHONY: migration-apply
migration-apply: ## Apply pending migrations to the database
	dotnet ef database update --project $(INFRA_PROJECT) --startup-project $(API_PROJECT)

.PHONY: migration-remove
migration-remove: ## Remove the last migration
	dotnet ef migrations remove --project $(INFRA_PROJECT) --startup-project $(API_PROJECT)

.PHONY: migration-list
migration-list: ## List all migrations
	dotnet ef migrations list --project $(INFRA_PROJECT) --startup-project $(API_PROJECT)

.PHONY: migration-script
migration-script: ## Generate a SQL script from all migrations
	dotnet ef migrations script --project $(INFRA_PROJECT) --startup-project $(API_PROJECT) -o ./migrations.sql

# ─── Docker Commands ───────────────────────────────────────────────

.PHONY: docker-build
docker-build: ## Build all Docker images (no cache)
	$(DOCKER_COMPOSE) build --no-cache

.PHONY: docker-up
docker-up: ## Start all services in detached mode
	$(DOCKER_COMPOSE) up --build -d

.PHONY: docker-up-logs
docker-up-logs: ## Start all services with attached logs
	$(DOCKER_COMPOSE) up --build

.PHONY: docker-down
docker-down: ## Stop and remove all containers
	$(DOCKER_COMPOSE) down

.PHONY: docker-restart
docker-restart: docker-down docker-up ## Restart all Docker services

.PHONY: docker-logs
docker-logs: ## Tail logs from all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: docker-ps
docker-ps: ## List running Docker services
	$(DOCKER_COMPOSE) ps

.PHONY: docker-clean
docker-clean: ## Stop containers and remove volumes (full reset)
	$(DOCKER_COMPOSE) down -v

# ─── Frontend Commands ─────────────────────────────────────────────

.PHONY: frontend-install
frontend-install: ## Install frontend dependencies (clean install)
	cd $(FRONTEND_DIR) && npm ci

.PHONY: frontend-dev
frontend-dev: ## Start the Vite development server
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: frontend-build
frontend-build: ## TypeScript check + production build
	cd $(FRONTEND_DIR) && npm run build

.PHONY: frontend-lint
frontend-lint: ## Run oxlint (frontend linter)
	cd $(FRONTEND_DIR) && npm run lint

.PHONY: frontend-clean
frontend-clean: ## Remove node_modules and dist
	rm -rf $(FRONTEND_DIR)/node_modules $(FRONTEND_DIR)/dist

# ─── Combined / Utility Commands ───────────────────────────────────

.PHONY: setup
setup: ## One-shot: restore .NET packages + install frontend deps
	cp -n .env.example .env 2>/dev/null || true
	dotnet restore $(SOLUTION)
	cd $(FRONTEND_DIR) && npm ci

.PHONY: all
all: build frontend-build ## Build both backend and frontend for production

.PHONY: db-reset
db-reset: ## Drop database and re-apply all migrations (Docker-based)
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d postgres
	@sleep 3
	dotnet ef database update --project $(INFRA_PROJECT) --startup-project $(API_PROJECT)

.PHONY: help
help: ## Show this help message
	echo "Usage: make <target>"
	echo ""
	echo "── Dotnet Commands ──"
	echo "  restore             Restore NuGet packages"
	echo "  build               Build the entire .NET solution"
	echo "  rebuild             Clean and rebuild"
	echo "  test                Run all unit tests"
	echo "  test-coverage       Run tests with code coverage"
	echo "  run-api             Start the API server"
	echo "  watch-api           Start API server with hot reload"
	echo "  clean               Remove all build artifacts"
	echo "  publish             Publish API for production"
	echo ""
	echo "── EF Core Migrations ──"
	echo "  migration-add       Scaffold a new migration (name=<name>)"
	echo "  migration-apply     Apply pending migrations"
	echo "  migration-remove    Remove the last migration"
	echo "  migration-list      List all migrations"
	echo "  migration-script    Generate SQL script"
	echo ""
	echo "── Docker Commands ──"
	echo "  docker-build        Build all Docker images"
	echo "  docker-up           Start all services (detached)"
	echo "  docker-up-logs      Start all services (with logs)"
	echo "  docker-down         Stop and remove containers"
	echo "  docker-restart      Restart all services"
	echo "  docker-logs         Tail logs from all services"
	echo "  docker-ps           List running services"
	echo "  docker-clean        Down + remove volumes"
	echo ""
	echo "── Frontend Commands ──"
	echo "  frontend-install    Install dependencies (npm ci)"
	echo "  frontend-dev        Start Vite dev server"
	echo "  frontend-build      Production build"
	echo "  frontend-lint       Run oxlint"
	echo "  frontend-clean      Remove node_modules and dist"
	echo ""
	echo "── Combined / Utility ──"
	echo "  setup               One-shot initial setup"
	echo "  all                 Build backend + frontend"
	echo "  db-reset            Drop DB and re-apply migrations"
	echo "  help                Show this help message"
