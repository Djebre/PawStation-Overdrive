# PawStation Overdrive - PRD

## Original Problem Statement
Développer un jeu web mobile pour une convention "Space Groove". Le jeu doit être single-player avec des sessions jusqu'à 15 minutes et inclure un leaderboard global.

## Core Requirements
1. **Sélection de jeux** : 3 jeux distincts
   - ✅ Groove Orbit Runner (arcade skill-based)
   - ⏳ Space Groove Drift (chill/aesthetic)
   - ⏳ Groove Arena Overdrive (competitive hardcore)

2. **Backend API**
   - ✅ `POST /api/score` : Soumettre un score
   - ✅ `GET /api/leaderboard` : Récupérer les scores

3. **Visuals** : Thème "Cosmic Disco" (gold, electric blue, deep purple)

4. **Platform** : Mobile-only, portrait mode

5. **Page About** : ✅ Contenu dynamique depuis fichiers texte (FR/EN)

6. **Gestion des jeux** : ✅ Activation/désactivation via variables d'environnement

7. **Internationalisation** : ✅ Support FR/EN avec sélecteur de langue

8. **Musique** : ✅ Musique de fond avec contrôle de volume (placeholder tracks)

9. **Branding** : ✅ Aucun branding "Emergent"

10. **Anonymisation** : ✅ Références "furry" supprimées

## Tech Stack
- **Frontend** : React, Phaser.js, react-i18next, Tailwind CSS
- **Backend** : FastAPI, MongoDB (motor driver)
- **DevOps** : Docker, Docker Compose, Nginx

## What's Implemented
- ✅ Jeu "Groove Orbit Runner" complet
- ✅ Leaderboard et système de scores
- ✅ Traduction FR/EN avec sélecteur
- ✅ Page About dynamique (about.fr.txt / about.en.txt)
- ✅ Système de musique avec volume
- ✅ Docker & Docker Compose
- ✅ Système d'activation/désactivation des jeux

## Prioritized Backlog

### P1 - À faire
- [ ] Implémenter "Space Groove Drift"
- [ ] Implémenter "Groove Arena Overdrive"
- [ ] Intégrer musique spécifique par jeu

### P2 - Futur
- [ ] Ajouter plus de tracks musicaux
- [ ] Améliorer les effets visuels des jeux

## Key Files
- `frontend/src/pages/About.js` - Page About avec i18n
- `frontend/public/about.fr.txt` - Contenu About en français
- `frontend/public/about.en.txt` - Contenu About en anglais
- `frontend/src/components/game/GrooveOrbitRunner.js` - Premier jeu
- `backend/server.py` - API FastAPI

## Notes
- L'utilisateur gère le Docker lui-même
- Préférence pour docker compose (v2) vs docker-compose (v1)
