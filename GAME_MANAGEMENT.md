# 🎮 Gestion des Jeux - Guide d'Utilisation

Ce système vous permet d'activer ou désactiver les jeux individuellement, ou de mettre toute l'application en mode maintenance.

---

## 🚀 Quick Start

```bash
# Afficher l'état actuel
./manage-games.sh status

# Activer un jeu
./manage-games.sh enable a

# Désactiver tous les jeux
./manage-games.sh disable-all

# Mode maintenance
./manage-games.sh maintenance on

# Appliquer les changements
./manage-games.sh reload
```

---

## 📋 Commandes Disponibles

### Afficher l'État

```bash
./manage-games.sh status
```

Affiche l'état de tous les jeux et du mode maintenance.

### Activer/Désactiver un Jeu

```bash
# Activer
./manage-games.sh enable <jeu>

# Désactiver
./manage-games.sh disable <jeu>
```

Identifiants de jeux :
- `a` ou `game-a` → Groove Orbit Runner
- `b` ou `game-b` → Space Groove Drift
- `c` ou `game-c` → Groove Arena Overdrive

### Tous les Jeux

```bash
# Activer tous les jeux
./manage-games.sh enable-all

# Désactiver tous les jeux
./manage-games.sh disable-all
```

### Mode Maintenance

```bash
# Activer
./manage-games.sh maintenance on

# Désactiver
./manage-games.sh maintenance off
```

**Note :** Le mode maintenance désactive l'accès à TOUS les jeux, même ceux activés.

### Appliquer les Changements

```bash
./manage-games.sh reload
```

Redémarre le frontend avec la nouvelle configuration.

---

## 📝 Configuration Manuelle

Si vous préférez éditer directement, modifiez le fichier `.env.games` :

```bash
# Configuration des Jeux
# Activez ou désactivez les jeux en changeant true/false

# Groove Orbit Runner (Jeu A - Arcade)
GAME_A_ENABLED=true

# Space Groove Drift (Jeu B - Chill)
GAME_B_ENABLED=false

# Groove Arena Overdrive (Jeu C - Hardcore)
GAME_C_ENABLED=false

# Mode maintenance (désactive tous les jeux)
MAINTENANCE_MODE=false
```

Après modification, lancez :
```bash
./manage-games.sh reload
```

---

## 🐳 Avec Docker Compose

### Méthode 1 : Variables d'Environnement

```bash
# Définir les variables
export GAME_A_ENABLED=true
export GAME_B_ENABLED=true
export GAME_C_ENABLED=false
export MAINTENANCE_MODE=false

# Rebuild et redémarrer
docker-compose up -d --build frontend
```

### Méthode 2 : Fichier .env

Créez ou modifiez `.env` à la racine :

```env
GAME_A_ENABLED=true
GAME_B_ENABLED=true
GAME_C_ENABLED=false
MAINTENANCE_MODE=false
```

Puis :
```bash
docker-compose --env-file .env up -d --build frontend
```

### Méthode 3 : Script de Gestion

Le plus simple :
```bash
./manage-games.sh enable b
./manage-games.sh reload
```

---

## 🎯 Cas d'Usage

### Lancement de la Convention

Activer uniquement le jeu A (stable) :
```bash
./manage-games.sh disable-all
./manage-games.sh enable a
./manage-games.sh reload
```

### Ajout d'un Nouveau Jeu

Quand le jeu B est prêt :
```bash
./manage-games.sh enable b
./manage-games.sh reload
```

### Maintenance Urgente

```bash
./manage-games.sh maintenance on
./manage-games.sh reload
```

Les joueurs verront un message de maintenance au lieu des jeux.

### Fin de Maintenance

```bash
./manage-games.sh maintenance off
./manage-games.sh reload
```

### Désactiver Temporairement un Jeu Buggé

```bash
./manage-games.sh disable c
./manage-games.sh reload
```

Le jeu C n'apparaîtra plus dans le menu.

---

## 📊 Comportement de l'Interface

### Jeu Désactivé
- **N'apparaît PAS** dans la liste des jeux
- Pas de card affichée

### Mode Maintenance Activé
- **Tous les jeux** sont grisés et non cliquables
- **Message** de maintenance visible en haut
- Leaderboard et About restent accessibles

### Aucun Jeu Activé (sans maintenance)
- Message : "Aucun jeu n'est actuellement disponible"
- Interface reste accessible

---

## 🔧 Troubleshooting

### Les changements ne s'appliquent pas

```bash
# Vérifier le fichier de config
cat .env.games

# Forcer un rebuild complet
docker-compose down
docker-compose up -d --build --force-recreate frontend
```

### Docker Compose ne trouve pas les variables

Assurez-vous que `.env.games` est dans le même dossier que `docker-compose.yml`.

Ou spécifiez le fichier :
```bash
docker-compose --env-file .env.games up -d --build
```

### Le script ne fonctionne pas

Vérifier les permissions :
```bash
chmod +x manage-games.sh
```

---

## 📖 Exemples Complets

### Scénario 1 : Convention avec 1 Jeu

```bash
# Configuration initiale
./manage-games.sh disable-all
./manage-games.sh enable a
./manage-games.sh reload

# État
./manage-games.sh status
# Output:
# 🎮 Groove Orbit Runner (A):     ✅ Activé
# 🌊 Space Groove Drift (B):      ❌ Désactivé
# ⚡ Groove Arena Overdrive (C):  ❌ Désactivé
# 🔧 Maintenance:                 OFF
```

### Scénario 2 : Ajout Progressif

```bash
# Jour 1 : Jeu A uniquement
./manage-games.sh enable a
./manage-games.sh reload

# Jour 2 : Ajouter jeu B
./manage-games.sh enable b
./manage-games.sh reload

# Jour 3 : Tous les jeux
./manage-games.sh enable-all
./manage-games.sh reload
```

### Scénario 3 : Maintenance d'Urgence

```bash
# Problème détecté
./manage-games.sh maintenance on
./manage-games.sh reload

# ... correction du problème ...

# Retour à la normale
./manage-games.sh maintenance off
./manage-games.sh reload
```

---

## ⚙️ Configuration Avancée

### Variables d'Environnement dans Dockerfile

Le Dockerfile reçoit automatiquement ces variables :
- `REACT_APP_GAME_A_ENABLED`
- `REACT_APP_GAME_B_ENABLED`
- `REACT_APP_GAME_C_ENABLED`
- `REACT_APP_MAINTENANCE_MODE`

### Frontend : Accès aux Variables

Dans le code React :
```javascript
const gameAEnabled = process.env.REACT_APP_GAME_A_ENABLED !== 'false';
const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
```

### Production vs Development

**Development :**
```bash
# Utiliser .env.games local
./manage-games.sh enable a
./manage-games.sh reload
```

**Production :**
```bash
# Utiliser docker-compose.prod.yml avec .env
docker-compose -f docker-compose.prod.yml --env-file .env.games up -d --build
```

---

## 🎮 Intégration Continue

Pour automatiser les déploiements :

```bash
# Script de déploiement
#!/bin/bash

# Activer les jeux souhaités
export GAME_A_ENABLED=true
export GAME_B_ENABLED=true
export GAME_C_ENABLED=false
export MAINTENANCE_MODE=false

# Déployer
docker-compose up -d --build frontend

echo "✅ Déploiement terminé avec :"
echo "  - Jeu A: Activé"
echo "  - Jeu B: Activé"
echo "  - Jeu C: Désactivé"
```

---

**Le système est maintenant complètement configurable à la volée ! 🎉**
