# 🎮 Space Groove Arcade

> Collection de jeux arcade rétro-futuristes pour convention furry

Une expérience de jeu mobile immersive sur le thème "Space Groove" - un univers disco cosmique où les joueurs affrontent des défis orbitaux dans un style néon éblouissant.

![Space Groove Banner](./screenshots/01-homepage.png)

## 🌟 Caractéristiques

### 🎯 Jeux Disponibles

#### ✅ Groove Orbit Runner (Disponible)
**Genre:** Arcade Skill-Based

Un jeu de réflexes où vous contrôlez un astronaute furry tournant autour d'une planète disco. Changez d'orbite pour éviter les obstacles et survivez le plus longtemps possible !

**Mécaniques:**
- 3 orbites circulaires autour d'une planète centrale
- Tap/clic pour changer d'orbite instantanément
- Obstacles qui tournent en sens inverse
- Difficulté progressive (vitesse et fréquence d'obstacles)
- Système de score en temps réel
- Leaderboard global compétitif

![Groove Orbit Runner - Gameplay](./screenshots/03-game-playing.png)

#### 🔜 Space Groove Drift (Coming Soon)
**Genre:** Chill / Esthétique

Surfez sur des ondes musicales dans un espace vaporwave relaxant.

#### 🔜 Groove Arena Overdrive (Coming Soon)
**Genre:** Compétitif Hardcore

Arène fermée avec vagues d'ennemis rythmiques et système de dash au tempo.

---

## 📱 Interface

### Menu Principal
Interface de sélection élégante avec design glassmorphism et animations néon.

![Homepage](./screenshots/01-homepage.png)

### Leaderboard
Classement global avec système de médailles (Or 🥇, Argent 🥈, Bronze 🥉) et filtres par jeu.

![Leaderboard](./screenshots/04-leaderboard.png)

### Coming Soon
Pages dédiées pour les jeux en développement.

![Coming Soon](./screenshots/05-coming-soon.png)

---

## 🎨 Design

**Thème:** Disco Cosmique  
**Palette:**
- Neon Pink: `#ff71ce`
- Cyan Pop: `#01cdfe`
- Retro Gold: `#fffb96`
- Acid Green: `#05ffa1`
- Space Black: `#050612`
- Deep Purple: `#0d0221`

**Typographie:**
- Titres: Orbitron (Bold/Black)
- Corps: Rajdhani (Medium)
- Accents: Press Start 2P (Score, UI éléments)

**Optimisations:**
- Mobile-first, orientation portrait uniquement
- Viewport optimal: 390x844px
- Touch-action optimisée pour gameplay fluide
- Animations 60fps avec Phaser.js
- Starfield animé en arrière-plan

---

## 🛠️ Stack Technique

### Frontend
- **Framework:** React 19
- **Game Engine:** Phaser 3.90
- **Styling:** Tailwind CSS + Custom Design System
- **Routing:** React Router v7
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Motor async driver)
- **Validation:** Pydantic v2
- **CORS:** Enabled for web deployment

### Deployment
- **Architecture:** VPS avec Nginx reverse proxy
- **Frontend:** React build statique servi par Nginx
- **Backend:** FastAPI via Uvicorn/Gunicorn
- **Database:** MongoDB local ou cloud (MongoDB Atlas)

---

## 🚀 Installation

### Prérequis
- Python 3.10+
- Node.js 18+
- MongoDB 5.0+
- Yarn package manager

### Backend

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # ou `venv\Scripts\activate` sur Windows

# Installer dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres MongoDB

# Lancer le serveur
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend

```bash
cd frontend

# Installer dépendances
yarn install

# Configuration
cp .env.example .env
# Éditer REACT_APP_BACKEND_URL avec l'URL de votre backend

# Lancer en développement
yarn start

# Build de production
yarn build
```

---

## 📡 API Endpoints

### `POST /api/score`
Soumettre un score au leaderboard

**Body:**
```json
{
  "name": "PlayerName",
  "score": 420,
  "game_type": "groove-orbit-runner"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "PlayerName",
  "score": 420,
  "game_type": "groove-orbit-runner",
  "timestamp": "2026-02-14T23:26:46.014772Z"
}
```

### `GET /api/leaderboard`
Récupérer le classement

**Query Parameters:**
- `game_type` (optional): Filtrer par type de jeu
- `limit` (optional, default: 100): Nombre max de résultats

**Response:**
```json
[
  {
    "name": "SpaceRunner",
    "score": 420,
    "game_type": "groove-orbit-runner",
    "timestamp": "2026-02-14T23:26:46.132669Z",
    "rank": 1
  }
]
```

---

## 🎮 Gameplay - Groove Orbit Runner

### Contrôles
- **Mobile:** Tap n'importe où sur l'écran
- **Desktop:** Clic gauche ou barre espace

### Objectif
Survivre le plus longtemps possible en évitant les obstacles qui tournent autour de la planète disco.

### Scoring
- **+10 points** par obstacle évité
- **Bonus de vitesse** tous les 100 points
- **Game Over** en cas de collision

### Stratégie
1. **Anticipez** les obstacles plusieurs secondes à l'avance
2. **Changez d'orbite** au dernier moment pour maximiser les points
3. **Restez calme** quand la vitesse augmente
4. **Mémorisez** les patterns d'apparition des obstacles

---

## 📊 Spécifications VPS Recommandées

Pour une convention avec **50-100 joueurs simultanés** :

### Configuration Minimale
- **CPU:** 2 vCPU
- **RAM:** 2 GB
- **Storage:** 20 GB SSD
- **Bandwidth:** 2 TB/mois

### Configuration Recommandée
- **CPU:** 4 vCPU
- **RAM:** 4 GB
- **Storage:** 40 GB SSD
- **Bandwidth:** 5 TB/mois

### Optimisations
- Activer la compression gzip dans Nginx
- CDN pour assets statiques (optionnel)
- MongoDB indexes sur `score` et `game_type`
- Rate limiting sur l'API de soumission de scores

---

## 🔧 Configuration Nginx (Production)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend statique
    location / {
        root /var/www/space-groove/frontend/build;
        try_files $uri /index.html;
        
        # Cache des assets
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 🧪 Tests

### Backend Tests
```bash
cd backend
pytest backend_test.py -v
```

### Frontend Tests
```bash
cd frontend
yarn test
```

### Test Manuel
1. Lancer backend et frontend
2. Ouvrir http://localhost:3000
3. Jouer à Groove Orbit Runner
4. Vérifier la soumission de score
5. Consulter le leaderboard

---

## 📝 Roadmap

### Phase 1: MVP ✅
- [x] Jeu A: Groove Orbit Runner
- [x] Système de score et leaderboard
- [x] Design disco cosmique
- [x] Optimisation mobile portrait
- [x] API backend complète

### Phase 2: Expansion 🔄
- [ ] Jeu B: Space Groove Drift (Chill)
- [ ] Jeu C: Groove Arena Overdrive (Hardcore)
- [ ] Effets sonores et musique électro
- [ ] Animations de particules avancées

### Phase 3: Engagement 💡
- [ ] Système de badges/achievements
- [ ] Profils utilisateurs persistants
- [ ] Partage social (Twitter, Discord)
- [ ] Mode tournoi avec brackets
- [ ] Statistiques détaillées par joueur

### Phase 4: Polish ✨
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne
- [ ] Replay des meilleures parties
- [ ] Thèmes de couleurs alternatifs
- [ ] Support multi-langues

---

## 🐛 Bugs Connus

Aucun bug critique identifié. Tous les tests passent à 100%.

---

## 🤝 Contribution

Ce projet est conçu pour une convention furry spécifique. Si vous souhaitez l'adapter pour votre événement :

1. Forkez le repository
2. Personnalisez les couleurs dans `/frontend/tailwind.config.js`
3. Modifiez les textes dans les composants React
4. Ajustez les mécaniques de jeu dans `/frontend/src/pages/GrooveOrbitRunner.js`

---

## 📄 Licence

Projet créé pour une convention furry. Tous droits réservés.

---

## 🙏 Remerciements

- **Phaser.js** pour le moteur de jeu performant
- **Tailwind CSS** pour le système de design flexible
- **Unsplash** pour les images d'arrière-plan
- **Google Fonts** pour Orbitron, Rajdhani et Press Start 2P

---

## 📞 Support

Pour toute question ou problème technique pendant la convention :
- Consultez les logs: `tail -f /var/log/nginx/error.log`
- Vérifiez le status: `systemctl status mongodb`
- Redémarrez les services: `sudo systemctl restart nginx`

---

## 🎉 Convention Tips

### Pour les Organisateurs
1. **Testez avant l'événement** avec 10-20 utilisateurs simultanés
2. **Préparez un écran géant** pour afficher le leaderboard en temps réel
3. **Créez des challenges** (ex: "Premier à atteindre 500 points gagne un prix")
4. **Partagez le QR code** du site sur les flyers de la convention

### Pour les Joueurs
1. Utilisez votre vrai pseudo furry pour le leaderboard
2. Jouez en mode portrait pour une expérience optimale
3. Le son sera ajouté prochainement - restez à l'écoute !
4. Partagez vos meilleurs scores sur les réseaux sociaux avec #SpaceGroove

---

**Bon jeu et que la groove soit avec vous ! 🚀✨**
