# 🚀 Quick Start Guide

## For Local Development

### Prerequisites
- Docker & Docker Compose installed
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/Djebre/PawStation-Overdrive.git
cd PawStation-Overdrive

# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8001/api
```

### Without Docker

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload
```

#### Frontend
```bash
cd frontend
yarn install
yarn start
```

## For Production Deployment

### On Your VPS

1. **Install Docker & Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

2. **Clone and Deploy**
   ```bash
   git clone https://github.com/Djebre/PawStation-Overdrive.git
   cd PawStation-Overdrive
   ./deploy.sh
   ```

3. **Setup SSL (for pawstation.djebre.fr)**
   ```bash
   sudo certbot certonly --standalone -d pawstation.djebre.fr
   sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/*.pem nginx/ssl/
   docker-compose -f docker-compose.prod.yml restart frontend
   ```

## Architecture

```
PawStation-Overdrive/
├── frontend/          # React + Phaser.js game
├── backend/           # FastAPI + MongoDB
├── nginx/             # Production Nginx config
├── docker-compose.yml # Development
└── deploy.sh          # Automated deployment
```

## Documentation

- **[README.md](./README.md)** - Complete project documentation
- **[DEPLOYMENT_DOCKER.md](./DEPLOYMENT_DOCKER.md)** - Full Docker deployment guide (French)
- **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Visual design guide
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

## Live Demo

**🌐 https://pawstation.djebre.fr**

Try the game, compete on the leaderboard, and have fun! 🎮✨

---

For detailed setup and troubleshooting, see the full documentation.
