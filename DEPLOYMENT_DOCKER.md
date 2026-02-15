# 🐳 Déploiement Docker - PawStation Overdrive

Guide complet pour déployer Space Groove Arcade sur **pawstation.djebre.fr** avec Docker.

---

## 📋 Prérequis

### Serveur VPS
- Ubuntu 22.04 LTS ou Debian 11
- 4 vCPU, 4 GB RAM recommandé
- Docker et Docker Compose installés
- Accès root ou sudo
- Domaine pointant vers le serveur

### DNS Configuration
Assurez-vous que ces enregistrements DNS pointent vers votre serveur :
```
A     pawstation.djebre.fr        -> VOTRE_IP_SERVEUR
A     www.pawstation.djebre.fr    -> VOTRE_IP_SERVEUR
```

---

## 🛠️ Installation Docker

### 1. Installer Docker
```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Installer les prérequis
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajouter la clé GPG Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Vérifier l'installation
sudo docker --version
```

### 2. Installer Docker Compose
```bash
# Télécharger Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Rendre exécutable
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier
docker-compose --version
```

### 3. Ajouter l'utilisateur au groupe Docker
```bash
sudo usermod -aG docker $USER
newgrp docker

# Tester sans sudo
docker ps
```

---

## 📦 Déploiement de l'Application

### 1. Cloner le Repository
```bash
cd ~
git clone https://github.com/Djebre/PawStation-Overdrive.git
cd PawStation-Overdrive
```

### 2. Configuration SSL (Let's Encrypt)

#### Option A : Avec Certbot (recommandé)
```bash
# Installer Certbot
sudo apt install -y certbot

# Obtenir les certificats (arrêter Docker temporairement si port 80 occupé)
sudo certbot certonly --standalone -d pawstation.djebre.fr -d www.pawstation.djebre.fr

# Créer le dossier SSL pour Docker
mkdir -p nginx/ssl

# Copier les certificats
sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/privkey.pem nginx/ssl/
sudo chmod 644 nginx/ssl/*.pem
```

#### Option B : Certificats existants
```bash
mkdir -p nginx/ssl
# Copier vos certificats
cp /path/to/fullchain.pem nginx/ssl/
cp /path/to/privkey.pem nginx/ssl/
```

### 3. Variables d'Environnement
```bash
# Copier le fichier de production
cp .env.production .env

# Ou créer manuellement
cat > .env << EOF
MONGO_URL=mongodb://mongodb:27017
DB_NAME=spacegroove_production
CORS_ORIGINS=https://pawstation.djebre.fr,https://www.pawstation.djebre.fr
REACT_APP_BACKEND_URL=https://pawstation.djebre.fr
EOF
```

### 4. Lancer l'Application
```bash
# Build et démarrer en mode production
docker-compose -f docker-compose.prod.yml up -d --build

# Vérifier que tout tourne
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔍 Vérification

### 1. Tester l'API Backend
```bash
curl https://pawstation.djebre.fr/api/
# Devrait retourner: {"message":"Space Groove Arcade API"}

# Tester soumission de score
curl -X POST https://pawstation.djebre.fr/api/score \
  -H "Content-Type: application/json" \
  -d '{"name":"TestDocker","score":999,"game_type":"groove-orbit-runner"}'

# Récupérer le leaderboard
curl https://pawstation.djebre.fr/api/leaderboard
```

### 2. Tester le Frontend
Ouvrir dans un navigateur :
```
https://pawstation.djebre.fr
```

Vérifier :
- ✅ Page charge avec HTTPS
- ✅ Jeu Groove Orbit Runner lance
- ✅ Soumission de score fonctionne
- ✅ Leaderboard s'affiche

---

## 📊 Monitoring

### Commandes Utiles
```bash
# Voir les conteneurs
docker-compose -f docker-compose.prod.yml ps

# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Statistiques des conteneurs
docker stats

# Inspecter un conteneur
docker inspect spacegroove-backend-prod

# Accéder au shell d'un conteneur
docker exec -it spacegroove-backend-prod bash
docker exec -it spacegroove-mongodb-prod mongosh
```

### Script de Monitoring
```bash
cat > ~/monitor-docker.sh << 'EOF'
#!/bin/bash
echo "=== PawStation Status ==="
echo ""
echo "Containers:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "Disk Usage:"
df -h / | tail -1
echo ""
echo "Memory:"
free -h | grep Mem
echo ""
echo "Top Scores:"
docker exec spacegroove-mongodb-prod mongosh spacegroove_production --quiet --eval "db.scores.find({}, {name:1, score:1, _id:0}).sort({score:-1}).limit(5)"
EOF

chmod +x ~/monitor-docker.sh
./monitor-docker.sh
```

---

## 🔄 Mises à Jour

### Déployer une Nouvelle Version
```bash
cd ~/PawStation-Overdrive

# Récupérer les derniers changements
git pull

# Rebuild et redémarrer
docker-compose -f docker-compose.prod.yml up -d --build

# Nettoyer les anciennes images
docker image prune -f
```

### Redémarrer les Services
```bash
# Redémarrer tout
docker-compose -f docker-compose.prod.yml restart

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 💾 Backup & Restore

### Backup MongoDB
```bash
# Créer le dossier de backup
mkdir -p ~/backups

# Backup manuel
DATE=$(date +%Y%m%d_%H%M%S)
docker exec spacegroove-mongodb-prod mongodump --db spacegroove_production --out /data/backup_$DATE
docker cp spacegroove-mongodb-prod:/data/backup_$DATE ~/backups/

# Script de backup automatique
cat > ~/backup-mongo.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

docker exec spacegroove-mongodb-prod mongodump --db spacegroove_production --out /data/backup_$DATE
docker cp spacegroove-mongodb-prod:/data/backup_$DATE $BACKUP_DIR/

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -type d -name "backup_*" -mtime +7 -exec rm -rf {} +

echo "Backup completed: $BACKUP_DIR/backup_$DATE"
EOF

chmod +x ~/backup-mongo.sh

# Ajouter au crontab (tous les jours à 3h)
crontab -e
# Ajouter: 0 3 * * * /home/$USER/backup-mongo.sh >> /home/$USER/backup.log 2>&1
```

### Restore MongoDB
```bash
# Copier le backup dans le conteneur
docker cp ~/backups/backup_20260214_030000 spacegroove-mongodb-prod:/data/

# Restaurer
docker exec spacegroove-mongodb-prod mongorestore /data/backup_20260214_030000
```

---

## 🔥 Firewall Configuration

```bash
# Installer UFW
sudo apt install -y ufw

# Configuration
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Activer
sudo ufw enable
sudo ufw status
```

---

## 🚨 Troubleshooting

### Conteneurs ne démarrent pas
```bash
# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs

# Vérifier les ports
sudo netstat -tlnp | grep -E '80|443|8001|27017'

# Reconstruire from scratch
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

### Erreur SSL
```bash
# Vérifier les certificats
ls -la nginx/ssl/

# Renouveler Let's Encrypt
sudo certbot renew
sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/*.pem nginx/ssl/
docker-compose -f docker-compose.prod.yml restart frontend
```

### Backend ne répond pas
```bash
# Vérifier backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Tester depuis l'intérieur du réseau Docker
docker exec spacegroove-frontend-prod curl http://backend:8001/api/
```

### MongoDB connection failed
```bash
# Vérifier MongoDB
docker-compose -f docker-compose.prod.yml logs mongodb

# Tester la connexion
docker exec spacegroove-mongodb-prod mongosh --eval "db.runCommand({ping:1})"
```

---

## 🎯 Optimisations Production

### 1. Activer le Renouvellement Auto SSL
```bash
# Créer un hook de renouvellement
sudo mkdir -p /etc/letsencrypt/renewal-hooks/post
sudo cat > /etc/letsencrypt/renewal-hooks/post/docker-reload.sh << 'EOF'
#!/bin/bash
cp /etc/letsencrypt/live/pawstation.djebre.fr/*.pem ~/PawStation-Overdrive/nginx/ssl/
cd ~/PawStation-Overdrive
docker-compose -f docker-compose.prod.yml restart frontend
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/post/docker-reload.sh
```

### 2. Limiter les Ressources
Modifier `docker-compose.prod.yml` :
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### 3. Logs Rotation
```bash
# Configurer Docker logs rotation
sudo cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
```

---

## ✅ Checklist de Déploiement

### Avant la Convention
- [ ] DNS configuré et propagé
- [ ] SSL/HTTPS fonctionnel
- [ ] Tous les services démarrent correctement
- [ ] API testée (POST score, GET leaderboard)
- [ ] Frontend accessible et fonctionnel
- [ ] Backup automatique configuré
- [ ] Monitoring en place
- [ ] Firewall activé
- [ ] Tests de charge effectués

### Jour J
- [ ] Vérifier tous les conteneurs: `docker-compose ps`
- [ ] Vérifier les logs: `docker-compose logs`
- [ ] Tester l'application complète
- [ ] Préparer QR code: https://pawstation.djebre.fr

---

## 📞 Commandes Rapides

```bash
# Arrêter tout
docker-compose -f docker-compose.prod.yml down

# Démarrer tout
docker-compose -f docker-compose.prod.yml up -d

# Rebuild complet
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate

# Nettoyer Docker
docker system prune -a --volumes

# Backup rapide
./backup-mongo.sh

# Monitoring
./monitor-docker.sh
```

---

**Votre application est maintenant déployée sur https://pawstation.djebre.fr ! 🚀🎮**

Pour toute question, consultez les logs avec `docker-compose logs -f`
