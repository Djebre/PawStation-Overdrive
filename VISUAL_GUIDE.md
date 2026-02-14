# 🎨 Guide Visuel - Space Groove Arcade

## 📸 Captures d'Écran du Jeu

### 1. Page d'Accueil
**Menu principal avec sélection des 3 jeux**

- Design disco cosmique avec gradient animé
- Cards des 3 jeux avec état (disponible/coming soon)
- Indicateur vert pour le jeu actif
- Bouton leaderboard en bas
- Starfield animé en arrière-plan

**Éléments visibles:**
- Titre "SPACE GROOVE" avec effet shimmer
- Groove Orbit Runner (actif, icône fusée)
- Space Groove Drift (coming soon, icône vagues)
- Groove Arena Overdrive (coming soon, icône éclair)

---

### 2. Jeu - Groove Orbit Runner (Démarrage)
**Vue initiale du jeu avant les obstacles**

- Planète disco centrale tricolore (rose/cyan/or)
- 3 orbites circulaires visibles
- Joueur (cercle rose) sur l'orbite du milieu
- Score "0" en haut à gauche (Police Press Start 2P)
- Hint "TAP TO CHANGE ORBIT" en bas
- 100 étoiles scintillantes

**Dimensions:** 390x844px (portrait mobile)

---

### 3. Jeu en Action
**Gameplay avec obstacles**

- Joueur naviguant entre les orbites
- Obstacles verts (acid-green) sur différentes orbites
- Score qui s'incrémente en temps réel
- Vitesse qui augmente progressivement
- Effet de rotation fluide

**Mécaniques visibles:**
- Détection de collision (distance < 20px)
- Changement d'orbite avec tween de 200ms
- Spawn des obstacles à l'opposé du joueur

---

### 4. Leaderboard
**Classement global avec médailles**

- Header avec titre "Leaderboard" 
- Filtres: "Tous les jeux" / "Orbit Runner"
- Top 3 avec couleurs distinctes:
  - 🥇 1er place: Or (#fffb96) avec icône trophée
  - 🥈 2ème place: Argent (#ddd) avec icône trophée  
  - 🥉 3ème place: Bronze (#cd7f32) avec icône trophée
  - 4+: Cyan (#01cdfe) avec numéro

**Données affichées:**
- Nom du joueur
- Score (grand, gras)
- Date et heure
- Position dans le classement

---

### 5. Page Coming Soon
**Placeholder pour jeux B & C**

- Icône Sparkles dorée animée (pulse)
- Nom du jeu en grand
- Message "En cours de développement"
- Texte explicatif
- Bouton "RETOUR AU MENU" (style cyberpunk)

**Exemple pour "Space Groove Drift":**
```
✨ (icône animée)
Space Groove Drift
En cours de développement
Ce jeu sera bientôt disponible. Restez à l'écoute !
[← RETOUR AU MENU]
```

---

## 🎨 Palette de Couleurs Appliquée

### Couleurs Principales
```
Space Black:  #050612  ███  (Fond)
Deep Purple:  #0d0221  ███  (Surfaces)
Neon Pink:    #ff71ce  ███  (Primary)
Cyan Pop:     #01cdfe  ███  (Secondary)
Retro Gold:   #fffb96  ███  (Accent)
Acid Green:   #05ffa1  ███  (Success/Obstacles)
```

### Application dans le Jeu
- **Planète centrale:** Gradients rose → cyan → or
- **Joueur:** Neon Pink (#ff71ce)
- **Obstacles:** Acid Green (#05ffa1)
- **Orbites:** Blanc semi-transparent (0.2)
- **Score:** Retro Gold (#fffb96)
- **Étoiles:** Blanc avec alpha variable (0.3-0.8)

---

## 🎭 États Interactifs

### Boutons
**État Normal:**
- Background: neon-pink
- Text: noir
- Shadow: glow rose

**État Hover:**
- Background: blanc
- Transform: translateY(-2px)
- Shadow: intensifié

**État Active:**
- Scale: 0.95
- Feedback tactile immédiat

### Cards de Jeu
**Disponible:**
- Border: white/20
- Hover border: cyan-pop/50
- Hover shadow: cyan glow
- Cursor: pointer
- Point vert actif animé

**Coming Soon:**
- Border: white/10
- Opacity: 0.6
- Grayscale sur l'icône
- Cursor: not-allowed
- Badge "COMING SOON" en or

---

## 🔤 Typographie en Action

### Titres (Orbitron)
```
SPACE GROOVE  (h1, 5xl, black weight)
Leaderboard   (h1, 4xl, black weight)
Game Over!    (h2, 3xl, black weight)
```

### Corps (Rajdhani)
```
Change orbits, dodge obstacles...  (base, medium)
Surf cosmic waves...               (base, medium)
En cours de développement          (lg, medium)
```

### Accents (Press Start 2P)
```
1250           (score, 2xl)
ARCADE SKILL-BASED   (xs, uppercase, tracking-widest)
TAP TO CHANGE ORBIT  (sm, uppercase)
```

---

## 📐 Layout & Spacing

### Structure Verticale (Mobile Portrait)
```
┌─────────────────┐
│   Header (80px) │  ← Titre + sous-titre
├─────────────────┤
│                 │
│   Content       │  ← Flex-1, scrollable
│   (cards/game)  │
│                 │
├─────────────────┤
│  CTA (80px)     │  ← Bouton principal
└─────────────────┘
```

### Espacements
- Container padding: `p-6` (24px)
- Section gap: `gap-8` (32px)
- Card gap: `gap-6` (24px)
- Button padding: `px-8 py-4` (32px/16px)

---

## ✨ Animations Clés

### 1. Text Shimmer (Titre)
```css
animation: text-shimmer 3s ease-in-out infinite
Effet: Gradient qui se déplace de gauche à droite
```

### 2. Starfield Twinkle
```css
animation: twinkle 8s ease-in-out infinite
Effet: Opacité qui pulse (1 → 0.5 → 1)
```

### 3. Pulse Glow (Indicateur actif)
```css
animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite
Effet: Point vert qui pulse
```

### 4. Orbit Change (Gameplay)
```javascript
Tween de 200ms avec ease Power2
Transition smooth entre orbites
```

### 5. Card Hover
```css
transition: all 300ms ease-out
transform: translateY(-4px) + scale(1.02)
```

---

## 🎯 Points d'Attention UX

### Feedback Visuel Immédiat
✅ Boutons avec scale active (0.95)
✅ Cards avec hover glow
✅ Indicateur vert sur jeu actif
✅ Flash blanc au game over
✅ Shadow intense sur éléments interactifs

### Hiérarchie Claire
✅ Score XXL en or pour attirer l'œil
✅ Médailles top 3 distinguables
✅ Coming Soon badge bien visible
✅ CTA principal en bas (toujours accessible)

### États Désactivés
✅ Opacity réduite (0.6)
✅ Grayscale sur icônes
✅ Cursor not-allowed
✅ Pas de hover effect

---

## 📱 Optimisation Mobile

### Touch Targets
- Minimum 44x44px (iOS guidelines)
- Boutons: 48px height minimum
- Cards: Full width, 192px height
- Spacing entre éléments: 24px minimum

### Performance
- Canvas Phaser limité à 390x844px
- 60 FPS maintenu avec 100 étoiles
- Pas de gradients complexes en animation
- GPU acceleration via transforms 3D

### Accessibilité
- Contraste AA/AAA respecté
- Text size: 16px minimum (corps)
- Touch-action: none sur game canvas
- Data-testid sur tous éléments interactifs

---

**Pour voir ces écrans en action, lancez l'application et naviguez ! 🎮✨**
