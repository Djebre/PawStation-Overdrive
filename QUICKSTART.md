# 🚀 Quick Start Guide

## Installation

### With Docker (Recommended)

```bash
git clone https://github.com/Djebre/PawStation-Overdrive.git
cd PawStation-Overdrive
docker compose up -d
```

Access: http://localhost:3000

### Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload
```

**Frontend:**
```bash
cd frontend
yarn install
yarn start
```

---

## Game Management

```bash
# Show status
./manage-games.sh status

# Enable/disable games
./manage-games.sh enable a    # Game A
./manage-games.sh disable b   # Game B

# All games
./manage-games.sh enable-all
./manage-games.sh disable-all

# Maintenance mode
./manage-games.sh maintenance on
./manage-games.sh maintenance off

# Apply changes
./manage-games.sh reload
```

---

## Configuration Files

**`.env.games`** - Game configuration
```env
GAME_A_ENABLED=true
GAME_B_ENABLED=false
GAME_C_ENABLED=false
MAINTENANCE_MODE=false
```

**`about.txt`** - About page content (Markdown supported)

---

## Production Deployment

### 1. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Setup SSL
```bash
sudo certbot certonly --standalone -d pawstation.djebre.fr
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/*.pem nginx/ssl/
```

### 3. Deploy
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## Useful Commands

```bash
# View logs
docker compose logs -f

# Restart service
docker compose restart frontend

# Stop all
docker compose down

# Rebuild
docker compose up -d --build
```

---

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Docker issues
```bash
docker compose down
docker system prune -af
docker compose up -d --build
```

---

For more details, see [README.md](./README.md)
