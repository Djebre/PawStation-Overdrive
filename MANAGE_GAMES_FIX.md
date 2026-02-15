# 🚀 Quick Fix - manage-games.sh

## Problème Résolu

L'erreur `export: not a valid identifier` était causée par les commentaires avec accents dans le fichier `.env.games`.

## Solution Appliquée

✅ Script mis à jour pour ignorer les commentaires
✅ Fichier `.env.games` simplifié (commentaires en anglais)
✅ Nouvelle version testée et fonctionnelle

## Test Rapide

```bash
# Sur votre VPS
cd ~/PawStation-Overdrive

# Vérifier le status
./manage-games.sh status

# Activer un jeu
./manage-games.sh enable b

# Appliquer les changements (NOUVELLE VERSION - fonctionne maintenant)
./manage-games.sh reload
```

## Contenu du Nouveau .env.games

```env
# Game Configuration
# Set true/false to enable/disable games

# Game A - Groove Orbit Runner (Arcade)
GAME_A_ENABLED=true

# Game B - Space Groove Drift (Chill)
GAME_B_ENABLED=false

# Game C - Groove Arena Overdrive (Hardcore)
GAME_C_ENABLED=false

# Maintenance mode (disables all games)
MAINTENANCE_MODE=false
```

## Alternative: Utiliser Docker Compose Directement

Si le script pose toujours problème, utilisez directement :

```bash
# Méthode 1: Variables inline
GAME_A_ENABLED=true GAME_B_ENABLED=true docker-compose up -d --build frontend

# Méthode 2: Fichier .env
echo "GAME_A_ENABLED=true" > .env
echo "GAME_B_ENABLED=true" >> .env
echo "GAME_C_ENABLED=false" >> .env
echo "MAINTENANCE_MODE=false" >> .env

docker-compose --env-file .env up -d --build frontend
```

## Fichiers Mis à Jour

1. `/app/manage-games.sh` - Version corrigée (v2.0)
2. `/app/.env.games` - Commentaires simplifiés
3. `/app/.env.games.production` - Version sans commentaires

## Test

```bash
# Doit fonctionner sans erreur maintenant
./manage-games.sh reload
```

Si vous voyez encore des erreurs, utilisez la version production :

```bash
cp .env.games.production .env.games
./manage-games.sh reload
```
