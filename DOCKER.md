# 🐳 Docker Deployment Guide for GoldenLoft

This guide will help you deploy GoldenLoft using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd Goldenloft

# Create environment file
cp .env.docker.example .env.docker
```

### 2. Configure Environment Variables

Edit `.env.docker` and set your secure values:

```env
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
NEXT_PUBLIC_API_URL=http://localhost:4000
```

⚠️ **Important**: Change these values for production!

### 3. Build and Start

```bash
# Build all services
docker-compose build

# Start all services
docker-compose --env-file .env.docker up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api
- **Database**: localhost:5432

## Services

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Data**: Persisted in Docker volume `postgres_data`

### Backend (NestJS)
- **Port**: 4000
- **Uploads**: Persisted in Docker volume `backend_uploads`
- **Health Check**: Automatic health monitoring

### Frontend (Next.js)
- **Port**: 3000
- **Optimized**: Standalone output for minimal image size

## Common Commands

### Start Services
```bash
docker-compose --env-file .env.docker up -d
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ Deletes all data)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart a Service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild After Code Changes
```bash
# Rebuild and restart specific service
docker-compose build backend
docker-compose up -d backend

# Rebuild everything
docker-compose build
docker-compose up -d
```

## Database Management

### Run Migrations
```bash
docker-compose exec backend npx prisma migrate deploy
```

### Access Prisma Studio
```bash
docker-compose exec backend npx prisma studio
```

### Access PostgreSQL CLI
```bash
docker-compose exec postgres psql -U goldenloft -d goldenloft
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U goldenloft goldenloft > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U goldenloft goldenloft < backup.sql
```

## Development vs Production

### Development
- Use `docker-compose.yml` as is
- Mount volumes for hot-reload (add volume mounts if needed)
- Access services directly

### Production
- Change all default passwords and secrets
- Use environment variables properly
- Consider using Docker secrets
- Set up proper reverse proxy (Nginx/Traefik)
- Enable HTTPS/SSL
- Configure proper CORS origins
- Set up monitoring and logging

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL in backend
docker-compose exec backend env | grep DATABASE_URL
```

### Frontend Can't Reach Backend
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration in backend
- Verify network connectivity between containers

### Container Won't Start
```bash
# Check logs
docker-compose logs [service-name]

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild and start
docker-compose build
docker-compose --env-file .env.docker up -d
```

## Security Best Practices

1. ✅ Never commit `.env.docker` file
2. ✅ Use strong passwords (minimum 32 characters)
3. ✅ Change default JWT secret
4. ✅ Run containers as non-root users (already configured)
5. ✅ Enable health checks (already configured)
6. ✅ Use specific image versions (not `latest`)
7. ✅ Scan images for vulnerabilities
8. ✅ Limit container resources if needed

## Performance Optimization

### Resource Limits (Optional)
Add to services in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Multi-Stage Build Benefits
- ✅ Smaller image sizes
- ✅ Faster builds with layer caching
- ✅ Separate build and runtime dependencies
- ✅ More secure (no build tools in production)

## Monitoring

### Check Service Health
```bash
docker-compose ps
```

### Monitor Resource Usage
```bash
docker stats
```

### View Container Logs
```bash
docker-compose logs -f --tail=100
```

## Next Steps

- Set up reverse proxy (Nginx/Traefik)
- Configure SSL/TLS certificates
- Set up automated backups
- Configure monitoring (Prometheus/Grafana)
- Set up log aggregation
- Implement CI/CD pipeline

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review health: `docker-compose ps`
- Rebuild: `docker-compose build --no-cache`

---

**Happy Deploying! 🚀**
