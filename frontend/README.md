# 🎮 Space Groove Arcade - Frontend

## Structure du Projet

```
frontend/
├── public/
│   └── index.html              # Point d'entrée HTML
├── src/
│   ├── components/
│   │   └── ui/                 # Composants Shadcn UI
│   ├── pages/
│   │   ├── Home.js             # Menu principal
│   │   ├── GrooveOrbitRunner.js # Jeu A avec Phaser
│   │   ├── Leaderboard.js      # Classement
│   │   └── ComingSoon.js       # Placeholder jeux B & C
│   ├── App.js                  # Router principal
│   ├── App.css                 # Styles du jeu
│   └── index.css               # Styles globaux + Design tokens
├── package.json
├── tailwind.config.js          # Configuration Tailwind + couleurs custom
└── .env                        # Variables d'environnement
```

## 🎨 Design System

### Couleurs Custom (Tailwind)

```javascript
// tailwind.config.js
colors: {
  'space-black': '#050612',   // Fond principal
  'deep-purple': '#0d0221',   // Surfaces
  'neon-pink': '#ff71ce',     // Primary
  'cyan-pop': '#01cdfe',      // Secondary
  'retro-gold': '#fffb96',    // Accent
  'acid-green': '#05ffa1'     // Success/Obstacles
}
```

### Fonts

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&family=Press+Start+2P&display=swap');

font-family: {
  orbitron: ['Orbitron', 'sans-serif'],      // Titres
  rajdhani: ['Rajdhani', 'sans-serif'],      // Corps
  accent: ['Press Start 2P', 'cursive']      // Score/UI
}
```

### Animations

```css
/* Starfield background */
.starfield {
  animation: twinkle 8s ease-in-out infinite;
}

/* Text shimmer effect */
animate-text-shimmer {
  animation: text-shimmer 3s ease-in-out infinite;
  background: linear-gradient(90deg, #ff71ce, #01cdfe, #ff71ce);
  background-size: 200% auto;
}
```

## 🎮 Intégration Phaser

### Configuration

```javascript
// GrooveOrbitRunner.js
const config = {
  type: Phaser.AUTO,
  width: 390,
  height: 844,
  parent: gameRef.current,
  backgroundColor: '#050612',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    create: createGame,
    update: updateGame
  }
};
```

### Éléments du Jeu

1. **Starfield (100 étoiles)**
   - Position aléatoire
   - Taille 1-2px
   - Alpha 0.3-0.8
   - Animation de scintillement

2. **Planète centrale**
   - 3 cercles concentriques (disco effect)
   - Couleurs: neon-pink, cyan-pop, retro-gold
   - Position fixe au centre (195, 422)

3. **Orbites**
   - 3 rayons: 150px, 220px, 290px
   - Lignes blanches semi-transparentes
   - Rotation constante

4. **Joueur**
   - Cercle rose de 12px
   - Rotation autour de la planète
   - Transition smooth entre orbites (200ms)

5. **Obstacles**
   - Cercles verts (acid-green) de 10px
   - Spawn aléatoire sur les 3 orbites
   - Vitesse progressive

### Mécaniques

```javascript
// Changement d'orbite
scene.input.on('pointerdown', () => {
  currentOrbit = (currentOrbit + 1) % orbits.length;
  scene.tweens.add({
    targets: player,
    x: newX,
    y: newY,
    duration: 200,
    ease: 'Power2'
  });
});

// Détection de collision
const dist = Phaser.Math.Distance.Between(
  player.x, player.y, 
  obstacle.x, obstacle.y
);
if (dist < 20) endGame();

// Système de score
if (obstaclePassed) {
  score += 10;
  if (score % 100 === 0) {
    speed += 0.3;
    spawnInterval -= 100;
  }
}
```

## 🔌 API Integration

### Configuration

```javascript
// App.js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
```

### Endpoints Utilisés

```javascript
// Soumettre un score
await axios.post(`${API}/score`, {
  name: playerName,
  score: finalScore,
  game_type: 'groove-orbit-runner'
});

// Récupérer le leaderboard
const response = await axios.get(`${API}/leaderboard`, {
  params: { game_type: filter }
});
```

## 📱 Optimisations Mobile

### Touch Actions

```css
/* App.css */
.game-container {
  touch-action: none;           /* Désactive le scroll */
  -webkit-user-select: none;    /* Désactive la sélection */
}
```

### Viewport

```html
<!-- public/index.html -->
<meta name="viewport" 
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

### Performance

1. **Canvas unique** - Pas de redraw inutile
2. **Object pooling** - Réutilisation des obstacles
3. **RAF sync** - Phaser utilise requestAnimationFrame
4. **CSS GPU acceleration** - transforms 3D

## 🧩 Composants Principaux

### Home.js
- Menu de sélection des jeux
- Cards avec hover effects
- Navigation vers jeu/leaderboard

### GrooveOrbitRunner.js
- Composant Phaser
- Game loop complet
- Modal game over
- Soumission de score

### Leaderboard.js
- Fetch des scores
- Filtres par jeu
- Système de ranking
- Couleurs top 3

### ComingSoon.js
- Placeholder pour jeux futurs
- Navigation de retour

## 🚀 Build & Deployment

### Développement

```bash
yarn start
# Ouvre http://localhost:3000
```

### Production

```bash
yarn build
# Crée /build avec optimisations:
# - Minification JS/CSS
# - Tree shaking
# - Code splitting
# - Assets hashing
```

### Variables d'Environnement

```bash
# .env
REACT_APP_BACKEND_URL=https://votre-domaine.com
```

## 🎯 Data Test IDs

Pour tests automatisés (Playwright/Cypress) :

```javascript
// Home
data-testid="main-title"
data-testid="game-card-groove-orbit-runner"
data-testid="leaderboard-button"

// Game
data-testid="game-over-modal"
data-testid="final-score"
data-testid="player-name-input"
data-testid="submit-score-button"

// Leaderboard
data-testid="filter-all"
data-testid="leaderboard-entry-0"
```

## 🐛 Debugging

### Console Logs

```javascript
// Activer les logs Phaser
const config = {
  // ...
  physics: {
    arcade: { debug: true }  // Affiche hitboxes
  }
};
```

### React DevTools

```bash
# Installer l'extension navigateur
# Inspecter composants et props
```

## 📦 Dépendances Clés

```json
{
  "phaser": "^3.90.0",              // Game engine
  "react-router-dom": "^7.5.1",     // Routing
  "axios": "^1.8.4",                // HTTP
  "lucide-react": "^0.507.0",       // Icons
  "tailwindcss": "^3.4.17",         // Styling
  "sonner": "^2.0.3"                // Toasts (future)
}
```

## 🔧 Scripts Utiles

```bash
# Lint
yarn lint

# Format
yarn format

# Analyze bundle
yarn build && npx source-map-explorer 'build/static/js/*.js'

# Clear cache
rm -rf node_modules/.cache
```

---

**Happy Coding! 🚀**
