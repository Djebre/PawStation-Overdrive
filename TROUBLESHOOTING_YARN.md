# 🔧 Fix: yarn.lock not found in Docker

## Votre Erreur Actuelle

```
target frontend: failed to solve: failed to compute cache key: 
failed to calculate checksum of ref: "/yarn.lock": not found
```

## Solution Rapide (3 options)

### Option 1: Fix Dockerfile (RECOMMANDÉ)

Le Dockerfile a été mis à jour pour gérer ce cas. Testez :

```bash
cd /chemin/vers/PawStation-Overdrive

# Rebuild from scratch
docker-compose build --no-cache frontend
docker-compose up -d
```

### Option 2: Vérification Manuelle

```bash
cd frontend

# 1. Vérifier que yarn.lock existe
ls -lh yarn.lock
# Si absent: yarn install

# 2. Vérifier .dockerignore
cat .dockerignore | grep yarn
# Ne devrait PAS contenir "yarn.lock"

# 3. Build manuel
docker build -t test-frontend .

# 4. Debug verbose
docker build --no-cache --progress=plain . 2>&1 | grep -i yarn
```

### Option 3: Utiliser npm à la place de yarn

Si yarn continue de poser problème :

```bash
cd frontend

# Créer package-lock.json
npm install

# Utiliser Dockerfile alternatif
cat > Dockerfile.npm << 'EOF'
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build avec npm
docker build -f Dockerfile.npm -t spacegroove-frontend .
```

---

## Diagnostic Complet

### 1. Vérifier la Structure

Assurez-vous que votre structure est:

```
PawStation-Overdrive/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── yarn.lock          ← DOIT EXISTER
│   ├── nginx.conf
│   └── src/
└── backend/
```

### 2. Vérifier yarn.lock

```bash
# Doit afficher le fichier avec une taille > 0
ls -lh frontend/yarn.lock

# Si absent ou vide, le régénérer:
cd frontend
rm yarn.lock
yarn install
```

### 3. Vérifier le Contexte Docker

Dans `docker-compose.yml`:

```yaml
frontend:
  build:
    context: ./frontend    # ← Doit pointer vers frontend/
    dockerfile: Dockerfile
```

### 4. Nettoyer le Cache Docker

```bash
# Supprimer tous les caches
docker system prune -af
docker builder prune -af

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## Si Ça Ne Marche Toujours Pas

### Utiliser Pre-build (100% fiable)

Build le frontend localement puis copiez dans Docker:

```bash
# 1. Build localement
cd frontend
yarn install
yarn build

# 2. Créer Dockerfile simplifié
cat > Dockerfile.simple << 'EOF'
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 3. Build Docker
docker build -f Dockerfile.simple -t spacegroove-frontend .
docker run -d -p 3000:80 spacegroove-frontend
```

---

## Vérifier le Résultat

```bash
# Services en cours
docker-compose ps

# Logs frontend
docker-compose logs frontend

# Tester l'application
curl http://localhost:3000
```

---

## Fichiers de Référence

J'ai créé plusieurs alternatives dans `/app/frontend/`:

1. **Dockerfile** (par défaut, avec fallback)
2. **Dockerfile.flexible** (génère yarn.lock si absent)
3. **Dockerfile.npm** (utilise npm au lieu de yarn)
4. **debug-docker.sh** (script de diagnostic)

Pour utiliser une alternative:

```bash
docker-compose build --no-cache --build-arg DOCKERFILE=Dockerfile.flexible frontend
```

Ou modifier `docker-compose.yml`:

```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile.flexible  # ← Changer ici
```

---

## Contact & Support

Si le problème persiste après avoir essayé ces solutions:

1. Lancer le script de debug:
   ```bash
   cd frontend
   ./debug-docker.sh > debug-output.txt
   ```

2. Partager:
   - Le fichier `debug-output.txt`
   - Sortie de `ls -la frontend/`
   - Votre OS et version Docker

---

## TL;DR - Solution Ultra Rapide

```bash
cd frontend
yarn install  # Régénère yarn.lock
cd ..
docker-compose down
docker system prune -af
docker-compose build --no-cache
docker-compose up -d
```

Si ça ne marche pas → Utilisez Option 3 (npm) ou Pre-build
