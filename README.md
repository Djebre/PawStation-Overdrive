# 🎮 PawStation Overdrive

Collection de jeux arcade sur le thème Space Groove.

**🌐 Live:** https://pawstation.djebre.fr

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Djebre/PawStation-Overdrive.git
cd PawStation-Overdrive

# Start with Docker
docker compose up -d

# Access: http://localhost:3000
```

Voir [QUICKSTART.md](./QUICKSTART.md) pour plus de détails.

---

## 🎮 Jeux

### Groove Orbit Runner ✅
Jeu d'arcade où vous tournez autour d'une planète disco en évitant des obstacles.

### Space Groove Drift 🔜
Surfez sur des ondes cosmiques dans un univers vaporwave.

### Groove Arena Overdrive 🔜
Dashez au rythme dans une arène remplie d'ennemis.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Phaser 3.90, Tailwind CSS
- **Backend:** FastAPI, MongoDB
- **DevOps:** Docker Compose, Nginx

---

## ⚙️ Gestion des Jeux

Activez/désactivez les jeux à la volée :

```bash
./manage-games.sh status         # Voir l'état
./manage-games.sh enable a       # Activer jeu A
./manage-games.sh disable b      # Désactiver jeu B
./manage-games.sh maintenance on # Mode maintenance
./manage-games.sh reload         # Appliquer
```

---

## 📝 Configuration

### Jeux
Éditez `.env.games` :
```env
GAME_A_ENABLED=true
GAME_B_ENABLED=false
GAME_C_ENABLED=false
MAINTENANCE_MODE=false
```

### Page About
Éditez `about.txt` pour changer le contenu de la page À Propos.

---

## 🐳 Docker

```bash
# Development
docker compose up -d

# Production
docker compose -f docker-compose.prod.yml up -d

# Logs
docker compose logs -f

# Stop
docker compose down
```

---

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage
- [CHANGELOG.md](./CHANGELOG.md) - Historique des versions

---

## 📄 Licence

Projet personnel Space Groove 2026.

---

**Made with ❤️**
