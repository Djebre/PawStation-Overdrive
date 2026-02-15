#!/bin/bash

# 🎮 Script de gestion des jeux PawStation Overdrive

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

CONFIG_FILE=".env.games"

# Fonction pour afficher l'aide
show_help() {
    echo -e "${CYAN}🎮 PawStation Overdrive - Gestion des Jeux${NC}"
    echo ""
    echo "Usage: ./manage-games.sh [commande]"
    echo ""
    echo "Commandes:"
    echo "  status              Afficher l'état actuel des jeux"
    echo "  enable <jeu>        Activer un jeu"
    echo "  disable <jeu>       Désactiver un jeu"
    echo "  enable-all          Activer tous les jeux"
    echo "  disable-all         Désactiver tous les jeux"
    echo "  maintenance on      Activer le mode maintenance"
    echo "  maintenance off     Désactiver le mode maintenance"
    echo "  reload              Redémarrer avec la nouvelle configuration"
    echo ""
    echo "Jeux disponibles:"
    echo "  a, game-a           Groove Orbit Runner"
    echo "  b, game-b           Space Groove Drift"
    echo "  c, game-c           Groove Arena Overdrive"
    echo ""
    echo "Exemples:"
    echo "  ./manage-games.sh enable a"
    echo "  ./manage-games.sh disable-all"
    echo "  ./manage-games.sh maintenance on"
    echo "  ./manage-games.sh reload"
}

# Vérifier que le fichier de config existe
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Fichier $CONFIG_FILE introuvable${NC}"
    exit 1
fi

# Fonction pour lire la valeur actuelle
get_value() {
    grep "^$1=" "$CONFIG_FILE" | cut -d '=' -f2
}

# Fonction pour mettre à jour une valeur
set_value() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" "$CONFIG_FILE"; then
        sed -i "s/^${key}=.*/${key}=${value}/" "$CONFIG_FILE"
    else
        echo "${key}=${value}" >> "$CONFIG_FILE"
    fi
}

# Fonction pour afficher le statut
show_status() {
    echo -e "${CYAN}📊 État actuel des jeux:${NC}"
    echo ""
    
    local game_a=$(get_value "GAME_A_ENABLED")
    local game_b=$(get_value "GAME_B_ENABLED")
    local game_c=$(get_value "GAME_C_ENABLED")
    local maintenance=$(get_value "MAINTENANCE_MODE")
    
    if [ "$maintenance" = "true" ]; then
        echo -e "${RED}⚠️  MODE MAINTENANCE ACTIVÉ${NC}"
        echo ""
    fi
    
    echo -e "🎮 Groove Orbit Runner (A):     $([ "$game_a" = "true" ] && echo -e "${GREEN}✅ Activé${NC}" || echo -e "${RED}❌ Désactivé${NC}")"
    echo -e "🌊 Space Groove Drift (B):      $([ "$game_b" = "true" ] && echo -e "${GREEN}✅ Activé${NC}" || echo -e "${RED}❌ Désactivé${NC}")"
    echo -e "⚡ Groove Arena Overdrive (C):  $([ "$game_c" = "true" ] && echo -e "${GREEN}✅ Activé${NC}" || echo -e "${RED}❌ Désactivé${NC}")"
    echo ""
    echo -e "🔧 Maintenance:                 $([ "$maintenance" = "true" ] && echo -e "${RED}ON${NC}" || echo -e "${GREEN}OFF${NC}")"
}

# Fonction pour activer un jeu
enable_game() {
    local game=$1
    case $game in
        a|game-a)
            set_value "GAME_A_ENABLED" "true"
            echo -e "${GREEN}✅ Groove Orbit Runner activé${NC}"
            ;;
        b|game-b)
            set_value "GAME_B_ENABLED" "true"
            echo -e "${GREEN}✅ Space Groove Drift activé${NC}"
            ;;
        c|game-c)
            set_value "GAME_C_ENABLED" "true"
            echo -e "${GREEN}✅ Groove Arena Overdrive activé${NC}"
            ;;
        *)
            echo -e "${RED}❌ Jeu inconnu: $game${NC}"
            exit 1
            ;;
    esac
}

# Fonction pour désactiver un jeu
disable_game() {
    local game=$1
    case $game in
        a|game-a)
            set_value "GAME_A_ENABLED" "false"
            echo -e "${YELLOW}❌ Groove Orbit Runner désactivé${NC}"
            ;;
        b|game-b)
            set_value "GAME_B_ENABLED" "false"
            echo -e "${YELLOW}❌ Space Groove Drift désactivé${NC}"
            ;;
        c|game-c)
            set_value "GAME_C_ENABLED" "false"
            echo -e "${YELLOW}❌ Groove Arena Overdrive désactivé${NC}"
            ;;
        *)
            echo -e "${RED}❌ Jeu inconnu: $game${NC}"
            exit 1
            ;;
    esac
}

# Fonction pour activer tous les jeux
enable_all() {
    set_value "GAME_A_ENABLED" "true"
    set_value "GAME_B_ENABLED" "true"
    set_value "GAME_C_ENABLED" "true"
    echo -e "${GREEN}✅ Tous les jeux activés${NC}"
}

# Fonction pour désactiver tous les jeux
disable_all() {
    set_value "GAME_A_ENABLED" "false"
    set_value "GAME_B_ENABLED" "false"
    set_value "GAME_C_ENABLED" "false"
    echo -e "${YELLOW}❌ Tous les jeux désactivés${NC}"
}

# Fonction pour gérer la maintenance
set_maintenance() {
    local mode=$1
    if [ "$mode" = "on" ]; then
        set_value "MAINTENANCE_MODE" "true"
        echo -e "${RED}🔧 Mode maintenance ACTIVÉ${NC}"
        echo -e "${YELLOW}⚠️  Tous les jeux sont maintenant inaccessibles${NC}"
    else
        set_value "MAINTENANCE_MODE" "false"
        echo -e "${GREEN}✅ Mode maintenance DÉSACTIVÉ${NC}"
    fi
}

# Fonction pour recharger la configuration
reload_config() {
    echo -e "${CYAN}🔄 Redémarrage avec la nouvelle configuration...${NC}"
    
    # Charger les variables
    export $(cat $CONFIG_FILE | xargs)
    
    # Rebuild et restart frontend avec docker-compose
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d --build frontend
        echo -e "${GREEN}✅ Frontend redémarré avec succès${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker Compose non trouvé, veuillez redémarrer manuellement${NC}"
    fi
}

# Parser les arguments
case ${1:-} in
    status)
        show_status
        ;;
    enable)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Veuillez spécifier un jeu${NC}"
            show_help
            exit 1
        fi
        enable_game "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 N'oubliez pas de lancer: ./manage-games.sh reload${NC}"
        ;;
    disable)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Veuillez spécifier un jeu${NC}"
            show_help
            exit 1
        fi
        disable_game "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 N'oubliez pas de lancer: ./manage-games.sh reload${NC}"
        ;;
    enable-all)
        enable_all
        show_status
        echo ""
        echo -e "${YELLOW}💡 N'oubliez pas de lancer: ./manage-games.sh reload${NC}"
        ;;
    disable-all)
        disable_all
        show_status
        echo ""
        echo -e "${YELLOW}💡 N'oubliez pas de lancer: ./manage-games.sh reload${NC}"
        ;;
    maintenance)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Veuillez spécifier on ou off${NC}"
            exit 1
        fi
        set_maintenance "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 N'oubliez pas de lancer: ./manage-games.sh reload${NC}"
        ;;
    reload)
        reload_config
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Commande inconnue: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
