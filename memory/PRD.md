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
   - ✅ Les jeux désactivés affichent "Coming Soon" au lieu de disparaître

7. **Internationalisation** : ✅ Support FR/EN complet sur toutes les pages
   - ✅ Home, About, Leaderboard, Coming Soon, Game Over modal

8. **Musique** : ✅ Musique de fond avec contrôle de volume (placeholder tracks)

9. **Branding** : ✅ Aucun branding "Emergent"

10. **Anonymisation** : ✅ Références "furry" supprimées du code

## Tech Stack
- **Frontend** : React, Phaser.js, react-i18next, Tailwind CSS
- **Backend** : FastAPI, MongoDB (motor driver)
- **DevOps** : Docker, Docker Compose, Nginx

## What's Implemented (Décembre 2025)
- ✅ Jeu "Groove Orbit Runner" complet
- ✅ Leaderboard et système de scores
- ✅ Traduction FR/EN complète sur toutes les pages
- ✅ Page About dynamique (about.fr.txt / about.en.txt)
- ✅ Page Coming Soon traduite
- ✅ Système de musique avec volume
- ✅ Docker & Docker Compose
- ✅ Système d'activation/désactivation des jeux (avec Coming Soon visible)
- ✅ **Particules flottantes** sur la page d'accueil
- ✅ **Fond réactif à la musique** (visualisation audio)

## Prioritized Backlog

### P1 - À faire
- [ ] Implémenter "Space Groove Drift"
- [ ] Implémenter "Groove Arena Overdrive"
- [ ] Intégrer musique spécifique par jeu

### P2 - Futur
- [ ] Ajouter plus de tracks musicaux
- [ ] Améliorer les effets visuels des jeux

## Key Files
- `frontend/src/pages/Home.js` - Page principale avec sélection des jeux
- `frontend/src/pages/About.js` - Page About avec i18n
- `frontend/src/pages/ComingSoon.js` - Page Coming Soon traduite
- `frontend/src/pages/Leaderboard.js` - Classement traduit
- `frontend/src/pages/GrooveOrbitRunner.js` - Premier jeu avec i18n
- `frontend/src/i18n/translations.js` - Toutes les traductions FR/EN
- `frontend/public/about.fr.txt` - Contenu About en français
- `frontend/public/about.en.txt` - Contenu About en anglais
- `backend/server.py` - API FastAPI

## Notes
- L'utilisateur gère le Docker lui-même
- Préférence pour docker compose (v2) vs docker-compose (v1)
- Ne pas ajouter de watermarks ou branding
