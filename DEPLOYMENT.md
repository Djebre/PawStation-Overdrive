# 🚀 Guide de Déploiement VPS - Space Groove Arcade

Ce guide vous accompagne dans le déploiement complet de Space Groove Arcade sur votre VPS pour la convention.

## 📋 Prérequis VPS

### Configuration Recommandée
- **OS:** Ubuntu 22.04 LTS ou Debian 11
- **CPU:** 4 vCPU
- **RAM:** 4 GB
- **Storage:** 40 GB SSD
- **Bandwidth:** 5 TB/mois
- **Accès:** Root ou sudo

### Domaine & DNS
- Nom de domaine configuré (ex: spacegroove.convention.com)
- DNS A record pointant vers l'IP du VPS
- (Optionnel) Certificat SSL via Let's Encrypt

---

## 🛠️ Installation des Dépendances

### 1. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installation de Node.js 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Vérifier >= 20.x
```

### 3. Installation de Yarn
```bash
npm install -g yarn
yarn --version
```

### 4. Installation de Python 3.10+
```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version  # Vérifier >= 3.10
```

### 5. Installation de MongoDB
```bash
# Importer la clé GPG
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Ajouter le repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer
sudo apt update
sudo apt install -y mongodb-org

# Démarrer et activer au boot
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

### 6. Installation de Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📦 Déploiement de l'Application

### 1. Créer l'utilisateur de déploiement
```bash
sudo adduser spacegroove --disabled-password
sudo usermod -aG sudo spacegroove
sudo su - spacegroove
```

### 2. Cloner le repository
```bash
cd ~
git clone https://votre-repo.git space-groove
cd space-groove
```

### 3. Configuration du Backend

```bash
cd ~/space-groove/backend

# Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer dépendances
pip install -r requirements.txt

# Configuration
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=spacegroove_production
CORS_ORIGINS=https://votre-domaine.com
EOF

# Tester le backend
uvicorn server:app --host 127.0.0.1 --port 8001
# Ctrl+C pour arrêter
```

### 4. Configuration du Frontend

```bash
cd ~/space-groove/frontend

# Installer dépendances
yarn install

# Configuration
cat > .env << EOF
REACT_APP_BACKEND_URL=https://votre-domaine.com
EOF

# Build de production
yarn build

# Vérifier le build
ls -lh build/
```

---

## 🔧 Configuration Systemd (Backend)

### Créer le service systemd

```bash
sudo nano /etc/systemd/system/spacegroove-backend.service
```

Contenu :
```ini
[Unit]
Description=Space Groove Arcade Backend
After=network.target mongodb.service
Requires=mongodb.service

[Service]
Type=simple
User=spacegroove
WorkingDirectory=/home/spacegroove/space-groove/backend
Environment="PATH=/home/spacegroove/space-groove/backend/venv/bin"
ExecStart=/home/spacegroove/space-groove/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Activer et démarrer le service

```bash
sudo systemctl daemon-reload
sudo systemctl enable spacegroove-backend
sudo systemctl start spacegroove-backend
sudo systemctl status spacegroove-backend

# Logs
sudo journalctl -u spacegroove-backend -f
```

---

## 🌐 Configuration Nginx

### 1. Créer la configuration du site

```bash
sudo nano /etc/nginx/sites-available/spacegroove
```

Contenu :
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=score_submit:10m rate=10r/m;

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Logs
    access_log /var/log/nginx/spacegroove-access.log;
    error_log /var/log/nginx/spacegroove-error.log;

    # Frontend statique
    location / {
        root /home/spacegroove/space-groove/frontend/build;
        try_files $uri /index.html;

        # Cache des assets
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Pas de cache pour index.html
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Rate limiting sur soumission scores
        location /api/score {
            limit_req zone=score_submit burst=5 nodelay;
            proxy_pass http://127.0.0.1:8001;
        }
    }

    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               image/svg+xml;
}
```

### 2. Activer le site

```bash
# Lien symbolique
sudo ln -s /etc/nginx/sites-available/spacegroove /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## 🔒 Configuration SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Le renouvellement automatique est configuré
sudo systemctl status certbot.timer
```

---

## 🗄️ Configuration MongoDB

### Créer un utilisateur MongoDB (optionnel mais recommandé)

```bash
mongosh

use admin
db.createUser({
  user: "spacegroove_admin",
  pwd: "VOTRE_MOT_DE_PASSE_FORT",
  roles: [ { role: "readWrite", db: "spacegroove_production" } ]
})
exit
```

### Activer l'authentification

```bash
sudo nano /etc/mongod.conf
```

Ajouter :
```yaml
security:
  authorization: enabled
```

Redémarrer :
```bash
sudo systemctl restart mongod
```

Mettre à jour le backend `.env` :
```bash
MONGO_URL=mongodb://spacegroove_admin:PASSWORD@localhost:27017/spacegroove_production
```

### Créer des index pour performance

```bash
mongosh spacegroove_production

db.scores.createIndex({ "score": -1 })
db.scores.createIndex({ "game_type": 1, "score": -1 })
db.scores.createIndex({ "timestamp": -1 })
exit
```

---

## 📊 Monitoring & Maintenance

### 1. Logs à surveiller

```bash
# Backend
sudo journalctl -u spacegroove-backend -f

# Nginx access
sudo tail -f /var/log/nginx/spacegroove-access.log

# Nginx errors
sudo tail -f /var/log/nginx/spacegroove-error.log

# MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

### 2. Commandes utiles

```bash
# Redémarrer le backend
sudo systemctl restart spacegroove-backend

# Recharger Nginx (sans downtime)
sudo nginx -s reload

# Status général
sudo systemctl status spacegroove-backend nginx mongod

# Utilisation disque
df -h

# Utilisation RAM
free -h

# Processus
htop
```

### 3. Script de monitoring simple

```bash
cat > ~/monitor.sh << 'EOF'
#!/bin/bash

echo "=== Space Groove Status ==="
echo ""

echo "Backend:"
systemctl is-active spacegroove-backend
echo ""

echo "Nginx:"
systemctl is-active nginx
echo ""

echo "MongoDB:"
systemctl is-active mongod
echo ""

echo "Disk Usage:"
df -h / | tail -1
echo ""

echo "Memory:"
free -h | grep Mem
echo ""

echo "Top Scores:"
mongosh spacegroove_production --quiet --eval "db.scores.find({}, {name:1, score:1, _id:0}).sort({score:-1}).limit(5)"
EOF

chmod +x ~/monitor.sh
./monitor.sh
```

---

## 🔥 Firewall Configuration

```bash
# Installer UFW
sudo apt install -y ufw

# Règles de base
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser SSH (IMPORTANT !)
sudo ufw allow 22/tcp

# Autoriser HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer
sudo ufw enable
sudo ufw status
```

---

## 🧪 Tests Post-Déploiement

### 1. Test API Backend

```bash
# Health check
curl https://votre-domaine.com/api/

# Soumettre un score de test
curl -X POST https://votre-domaine.com/api/score \
  -H "Content-Type: application/json" \
  -d '{"name":"TestDeploy","score":999,"game_type":"groove-orbit-runner"}'

# Récupérer leaderboard
curl https://votre-domaine.com/api/leaderboard
```

### 2. Test Frontend

Ouvrir dans un navigateur mobile :
```
https://votre-domaine.com
```

Vérifier :
- ✅ Page d'accueil charge
- ✅ Jeu Groove Orbit Runner lance
- ✅ Game over modal apparaît
- ✅ Soumission de score fonctionne
- ✅ Leaderboard s'affiche

---

## 🚨 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les logs
sudo journalctl -u spacegroove-backend -n 50

# Vérifier MongoDB
sudo systemctl status mongod

# Tester manuellement
cd ~/space-groove/backend
source venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8001
```

### Frontend affiche erreur 502
```bash
# Backend down ?
sudo systemctl status spacegroove-backend

# Nginx mal configuré ?
sudo nginx -t
```

### Scores ne s'enregistrent pas
```bash
# Connexion MongoDB ok ?
mongosh spacegroove_production --eval "db.runCommand({ ping: 1 })"

# Voir les erreurs backend
sudo journalctl -u spacegroove-backend -f
```

### Performance lente
```bash
# Vérifier load
uptime
top

# Vérifier MongoDB
mongosh --eval "db.currentOp()"

# Vérifier connexions Nginx
netstat -an | grep :80 | wc -l
```

---

## 📈 Optimisations Avancées

### 1. Redis pour cache (optionnel)
```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
```

### 2. PM2 pour process management
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### 3. Backup automatique MongoDB
```bash
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db spacegroove_production --out /home/spacegroove/backups/$DATE
find /home/spacegroove/backups -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x ~/backup-db.sh

# Ajouter au crontab (tous les jours à 3h)
crontab -e
# Ajouter : 0 3 * * * /home/spacegroove/backup-db.sh
```

---

## 🎉 Checklist de Lancement

Avant la convention :
- [ ] Tests de charge (50+ utilisateurs simultanés)
- [ ] Backup MongoDB configuré
- [ ] Monitoring actif
- [ ] Certificat SSL valide
- [ ] DNS propagé
- [ ] Mobile responsive testé
- [ ] Logs rotation configurée
- [ ] Numéro de contact tech support prêt

Jour J :
- [ ] Vérifier tous les services
- [ ] Créer QR code du site
- [ ] Afficher leaderboard sur écran géant
- [ ] Annoncer challenges/prix

---

**Votre jeu est maintenant prêt pour la convention ! 🚀🎮✨**

En cas de problème, consultez les logs et n'hésitez pas à redémarrer les services si nécessaire.
