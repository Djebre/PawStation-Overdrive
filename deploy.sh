#!/bin/bash

# 🚀 Script d'installation rapide pour PawStation Overdrive
# Domain: https://pawstation.djebre.fr

set -e

echo "🎮 PawStation Overdrive - Installation Docker"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}⚠️  Ne pas exécuter ce script en tant que root${NC}"
    echo "Utilisez: ./deploy.sh"
    exit 1
fi

echo -e "${YELLOW}📋 Vérification des prérequis...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    echo "Installer Docker avec: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    echo "Voir: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker et Docker Compose sont installés${NC}"

# Check SSL certificates
echo ""
echo -e "${YELLOW}🔒 Vérification des certificats SSL...${NC}"

if [ ! -d "nginx/ssl" ]; then
    mkdir -p nginx/ssl
fi

if [ ! -f "nginx/ssl/fullchain.pem" ] || [ ! -f "nginx/ssl/privkey.pem" ]; then
    echo -e "${RED}❌ Certificats SSL manquants${NC}"
    echo ""
    echo "Option 1: Utiliser Let's Encrypt"
    echo "  sudo certbot certonly --standalone -d pawstation.djebre.fr -d www.pawstation.djebre.fr"
    echo "  sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/fullchain.pem nginx/ssl/"
    echo "  sudo cp /etc/letsencrypt/live/pawstation.djebre.fr/privkey.pem nginx/ssl/"
    echo ""
    echo "Option 2: Copier vos certificats existants dans nginx/ssl/"
    echo ""
    read -p "Voulez-vous continuer en mode développement HTTP seulement ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    USE_DEV=true
else
    echo -e "${GREEN}✅ Certificats SSL trouvés${NC}"
    USE_DEV=false
fi

# Check .env file
echo ""
echo -e "${YELLOW}⚙️  Configuration...${NC}"

if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    if [ "$USE_DEV" = true ]; then
        cp .env.docker .env
    else
        cp .env.production .env
    fi
    echo -e "${GREEN}✅ Fichier .env créé${NC}"
else
    echo -e "${GREEN}✅ Fichier .env existe${NC}"
fi

# Stop existing services
echo ""
echo -e "${YELLOW}🛑 Arrêt des services existants...${NC}"
docker compose down 2>/dev/null || true
docker compose -f docker compose.prod.yml down 2>/dev/null || true

# Build and start
echo ""
if [ "$USE_DEV" = true ]; then
    echo -e "${YELLOW}🔨 Build et démarrage en mode DÉVELOPPEMENT...${NC}"
    docker compose up -d --build
    DOMAIN="http://localhost:3000"
else
    echo -e "${YELLOW}🔨 Build et démarrage en mode PRODUCTION...${NC}"
    docker compose -f docker compose.prod.yml up -d --build
    DOMAIN="https://pawstation.djebre.fr"
fi

# Wait for services
echo ""
echo -e "${YELLOW}⏳ Attente du démarrage des services...${NC}"
sleep 10

# Check services
echo ""
echo -e "${YELLOW}🔍 Vérification des services...${NC}"

if [ "$USE_DEV" = true ]; then
    CONTAINERS=$(docker compose ps -q | wc -l)
    RUNNING=$(docker compose ps | grep "Up" | wc -l)
else
    CONTAINERS=$(docker compose -f docker compose.prod.yml ps -q | wc -l)
    RUNNING=$(docker compose -f docker compose.prod.yml ps | grep "Up" | wc -l)
fi

if [ $RUNNING -eq $CONTAINERS ]; then
    echo -e "${GREEN}✅ Tous les services sont démarrés ($RUNNING/$CONTAINERS)${NC}"
else
    echo -e "${RED}⚠️  Certains services ne sont pas démarrés ($RUNNING/$CONTAINERS)${NC}"
fi

# Test API
echo ""
echo -e "${YELLOW}🧪 Test de l'API...${NC}"
sleep 5

if [ "$USE_DEV" = true ]; then
    API_URL="http://localhost:8001"
else
    API_URL="https://pawstation.djebre.fr"
fi

if curl -s "${API_URL}/api/" | grep -q "Space Groove"; then
    echo -e "${GREEN}✅ API répond correctement${NC}"
else
    echo -e "${RED}⚠️  L'API ne répond pas comme attendu${NC}"
fi

# Display status
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Installation terminée !${NC}"
echo "=============================================="
echo ""
echo "🌐 Application accessible sur: $DOMAIN"
echo "📡 API Backend: ${API_URL}/api"
echo ""
echo "📋 Commandes utiles:"
echo ""
if [ "$USE_DEV" = true ]; then
    echo "  docker compose logs -f          # Voir les logs"
    echo "  docker compose ps               # Status des services"
    echo "  docker compose restart backend  # Redémarrer backend"
    echo "  docker compose down             # Arrêter tout"
else
    echo "  docker compose -f docker compose.prod.yml logs -f          # Voir les logs"
    echo "  docker compose -f docker compose.prod.yml ps               # Status des services"
    echo "  docker compose -f docker compose.prod.yml restart backend  # Redémarrer backend"
    echo "  docker compose -f docker compose.prod.yml down             # Arrêter tout"
fi
echo ""
echo "📚 Documentation complète: DEPLOYMENT_DOCKER.md"
echo ""
echo -e "${GREEN}Bon jeu ! 🚀🎮${NC}"
