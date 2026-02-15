<div align="center">

# 🎮 PawStation Overdrive

### Space Groove Arcade Collection

*Une expérience de jeu mobile immersive sur le thème disco cosmique*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-pawstation.djebre.fr-ff71ce?style=for-the-badge)](https://pawstation.djebre.fr)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./DEPLOYMENT_DOCKER.md)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](./LICENSE)

![Space Groove Banner](https://via.placeholder.com/800x200/050612/ff71ce?text=SPACE+GROOVE+ARCADE)

</div>

---

## ✨ Features

### 🎯 Groove Orbit Runner (Available Now!)
Jeu de réflexes arcade où vous tournez autour d'une planète disco :
- **3 orbites circulaires** avec changement instantané
- **Obstacles rotatifs** avec spawn dynamique
- **Difficulté progressive** (vitesse et fréquence)
- **Leaderboard global** compétitif
- **Design néon** spectaculaire (rose/cyan/or)

### 🔜 Coming Soon
- **Space Groove Drift** - Surf cosmique chill
- **Groove Arena Overdrive** - Arène hardcore rythmique
- **Audio system** - Effets sonores + musique électro

---

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# Clone
git clone https://github.com/Djebre/PawStation-Overdrive.git
cd PawStation-Overdrive

# Start development
docker-compose up -d

# Open http://localhost:3000
```

### Manual Installation

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

## 🌐 Live Demo

**🎮 Play Now:** [pawstation.djebre.fr](https://pawstation.djebre.fr)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 QUICKSTART.md](./QUICKSTART.md) | Quick setup guide |
| [🐳 DEPLOYMENT_DOCKER.md](./DEPLOYMENT_DOCKER.md) | Docker deployment (French) |
| [🎨 VISUAL_GUIDE.md](./VISUAL_GUIDE.md) | Design system & screenshots |
| [📋 CHANGELOG.md](./CHANGELOG.md) | Version history |
| [🚀 README.md](./README.md) | Complete documentation |

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Phaser 3.90 (Game Engine)
- Tailwind CSS 3.4
- React Router 7
- Lucide React (Icons)

**Backend:**
- FastAPI (Python 3.11)
- MongoDB (Motor async driver)
- Pydantic validation

**DevOps:**
- Docker & Docker Compose
- Nginx (reverse proxy + SSL)
- Supervisor (process management)

---

## 🎨 Design

**Theme:** Disco Cosmique

**Colors:**
- 🌸 Neon Pink: `#ff71ce`
- 🔵 Cyan Pop: `#01cdfe`
- ⭐ Retro Gold: `#fffb96`
- 🌌 Space Black: `#050612`

**Fonts:**
- Orbitron (headings)
- Rajdhani (body)
- Press Start 2P (score/accents)

---

## 📊 Project Status

- ✅ MVP Complete (v1.0.0)
- ✅ Game A: Groove Orbit Runner
- ✅ Leaderboard system
- ✅ Docker deployment
- ✅ SSL/HTTPS ready
- 🔄 Games B & C in development
- 🔄 Audio system planned

---

## 🤝 Contributing

This project is created for a specific furry convention. To adapt for your event:

1. Fork the repository
2. Customize colors in `tailwind.config.js`
3. Modify game mechanics in `GrooveOrbitRunner.js`
4. Update branding and text

---

## 📄 License

Proprietary - Created for Space Groove Convention 2026

---

## 🙏 Acknowledgments

- **Phaser.js** - Amazing game engine
- **Tailwind CSS** - Flexible design system
- **FastAPI** - Modern Python framework
- **MongoDB** - Reliable database
- **Community** - Furry convention organizers & players

---

<div align="center">

### 🎮 Ready to Play?

[![Visit Site](https://img.shields.io/badge/🚀_Visit_Site-pawstation.djebre.fr-ff71ce?style=for-the-badge&labelColor=050612)](https://pawstation.djebre.fr)

**Made with ❤️ for the furry community**

*Que la groove soit avec vous! 🚀✨*

</div>
