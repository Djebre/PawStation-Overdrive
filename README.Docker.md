# 🐳 Docker Deployment Guide

## Quick Start

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up --build -d
```

### Production

```bash
# Set environment variables
export BACKEND_URL=https://yourdomain.com
export CORS_ORIGINS=https://yourdomain.com

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Services

### Frontend (Port 3000 or 80)
- Built with React and Phaser
- Served by Nginx
- Auto-proxies API requests to backend

### Backend (Port 8001)
- FastAPI application
- Hot reload in development
- Multi-worker in production

### MongoDB (Port 27017)
- Persistent data storage
- Automatic database initialization

## Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **MongoDB:** mongodb://localhost:27017

## Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend sh

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Restart a service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v

# Check MongoDB data
docker-compose exec mongodb mongosh spacegroove_db
```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8001

# Stop conflicting services
sudo supervisorctl stop frontend backend
```

### Backend can't connect to MongoDB
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check logs
docker-compose logs mongodb
```

### Frontend build fails
```bash
# Clear Docker cache
docker-compose build --no-cache frontend

# Check yarn.lock exists
ls -la frontend/yarn.lock
```

## Environment Variables

Create `.env` file in project root:

```env
# Backend
MONGO_URL=mongodb://mongodb:27017
DB_NAME=spacegroove_db
CORS_ORIGINS=*

# Frontend
REACT_APP_BACKEND_URL=http://localhost:8001

# Production
BACKEND_URL=https://yourdomain.com
```

## Production Deployment

### With Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### With Docker Network

The containers communicate via internal Docker network, so no need to expose all ports externally.

## Data Persistence

MongoDB data is stored in Docker volume `mongodb_data`. To backup:

```bash
# Backup
docker-compose exec mongodb mongodump --out /data/backup
docker cp spacegroove-mongodb:/data/backup ./backup

# Restore
docker cp ./backup spacegroove-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

## Performance Tips

1. Use production docker-compose for better performance
2. Enable multi-worker backend in production
3. Use CDN for static assets
4. Enable MongoDB indexes (see DEPLOYMENT.md)

---

**Note:** For detailed VPS deployment without Docker, see [DEPLOYMENT.md](./DEPLOYMENT.md)