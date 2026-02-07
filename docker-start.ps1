# Docker Quick Start Script for GoldenLoft
# This script helps you get started with Docker deployment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  GoldenLoft Docker Setup 🐳" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Docker is installed" -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# Check if .env.docker exists
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env.docker")) {
    Write-Host "⚠️  .env.docker not found!" -ForegroundColor Yellow
    if (Test-Path ".env.docker.example") {
        Write-Host "Creating .env.docker from .env.docker.example..." -ForegroundColor Yellow
        Copy-Item ".env.docker.example" ".env.docker"
        Write-Host "✅ Created .env.docker" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Edit .env.docker and change the default values!" -ForegroundColor Yellow
        Write-Host "Press any key to continue or Ctrl+C to exit and edit the file first..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } else {
        Write-Host "❌ .env.docker.example not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env.docker found" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Starting GoldenLoft..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Ask user what to do
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Build and start all services (first time)" -ForegroundColor White
Write-Host "2. Start existing services" -ForegroundColor White
Write-Host "3. Stop all services" -ForegroundColor White
Write-Host "4. Rebuild and restart" -ForegroundColor White
Write-Host "5. View logs" -ForegroundColor White
Write-Host "6. Clean everything (removes all data!)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Building and starting all services..." -ForegroundColor Green
        docker-compose build
        docker-compose --env-file .env.docker up -d
        Write-Host ""
        Write-Host "✅ Services started!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access the application at:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "  Backend:  http://localhost:4000" -ForegroundColor White
        Write-Host "  API Docs: http://localhost:4000/api" -ForegroundColor White
    }
    "2" {
        Write-Host ""
        Write-Host "Starting services..." -ForegroundColor Green
        docker-compose --env-file .env.docker up -d
        Write-Host ""
        Write-Host "✅ Services started!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "Stopping services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host ""
        Write-Host "✅ Services stopped!" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "Rebuilding and restarting..." -ForegroundColor Yellow
        docker-compose down
        docker-compose build --no-cache
        docker-compose --env-file .env.docker up -d
        Write-Host ""
        Write-Host "✅ Services rebuilt and started!" -ForegroundColor Green
    }
    "5" {
        Write-Host ""
        Write-Host "Showing logs (Ctrl+C to exit)..." -ForegroundColor Yellow
        docker-compose logs -f
    }
    "6" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will delete all data!" -ForegroundColor Red
        $confirm = Read-Host "Are you sure? (yes/no)"
        if ($confirm -eq "yes") {
            Write-Host "Cleaning everything..." -ForegroundColor Yellow
            docker-compose down -v --rmi all
            Write-Host ""
            Write-Host "✅ Everything cleaned!" -ForegroundColor Green
        } else {
            Write-Host "Cancelled." -ForegroundColor Yellow
        }
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Done! 🎉" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For more commands, see DOCKER.md" -ForegroundColor Yellow
