#!/bin/bash

# 🎮 PawStation Overdrive - Game Management Script
# Version: 2.0 - Fixed export issue

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

CONFIG_FILE=".env.games"

show_help() {
    echo -e "${CYAN}🎮 PawStation Overdrive - Game Management${NC}"
    echo ""
    echo "Usage: ./manage-games.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status              Show current game status"
    echo "  enable <game>       Enable a game (a, b, or c)"
    echo "  disable <game>      Disable a game (a, b, or c)"
    echo "  enable-all          Enable all games"
    echo "  disable-all         Disable all games"
    echo "  maintenance on      Enable maintenance mode"
    echo "  maintenance off     Disable maintenance mode"
    echo "  reload              Apply configuration and restart"
    echo ""
    echo "Games:"
    echo "  a, game-a           Groove Orbit Runner"
    echo "  b, game-b           Space Groove Drift"
    echo "  c, game-c           Groove Arena Overdrive"
}

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

get_value() {
    grep "^$1=" "$CONFIG_FILE" | cut -d '=' -f2
}

set_value() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" "$CONFIG_FILE"; then
        sed -i "s/^${key}=.*/${key}=${value}/" "$CONFIG_FILE"
    else
        echo "${key}=${value}" >> "$CONFIG_FILE"
    fi
}

show_status() {
    echo -e "${CYAN}📊 Current Game Status:${NC}"
    echo ""
    
    local game_a=$(get_value "GAME_A_ENABLED")
    local game_b=$(get_value "GAME_B_ENABLED")
    local game_c=$(get_value "GAME_C_ENABLED")
    local maintenance=$(get_value "MAINTENANCE_MODE")
    
    if [ "$maintenance" = "true" ]; then
        echo -e "${RED}⚠️  MAINTENANCE MODE ACTIVE${NC}"
        echo ""
    fi
    
    echo -e "🎮 Groove Orbit Runner (A):     $([ "$game_a" = "true" ] && echo -e "${GREEN}✅ Enabled${NC}" || echo -e "${RED}❌ Disabled${NC}")"
    echo -e "🌊 Space Groove Drift (B):      $([ "$game_b" = "true" ] && echo -e "${GREEN}✅ Enabled${NC}" || echo -e "${RED}❌ Disabled${NC}")"
    echo -e "⚡ Groove Arena Overdrive (C):  $([ "$game_c" = "true" ] && echo -e "${GREEN}✅ Enabled${NC}" || echo -e "${RED}❌ Disabled${NC}")"
    echo ""
    echo -e "🔧 Maintenance:                 $([ "$maintenance" = "true" ] && echo -e "${RED}ON${NC}" || echo -e "${GREEN}OFF${NC}")"
}

enable_game() {
    local game=$1
    case $game in
        a|game-a)
            set_value "GAME_A_ENABLED" "true"
            echo -e "${GREEN}✅ Groove Orbit Runner enabled${NC}"
            ;;
        b|game-b)
            set_value "GAME_B_ENABLED" "true"
            echo -e "${GREEN}✅ Space Groove Drift enabled${NC}"
            ;;
        c|game-c)
            set_value "GAME_C_ENABLED" "true"
            echo -e "${GREEN}✅ Groove Arena Overdrive enabled${NC}"
            ;;
        *)
            echo -e "${RED}❌ Unknown game: $game${NC}"
            exit 1
            ;;
    esac
}

disable_game() {
    local game=$1
    case $game in
        a|game-a)
            set_value "GAME_A_ENABLED" "false"
            echo -e "${YELLOW}❌ Groove Orbit Runner disabled${NC}"
            ;;
        b|game-b)
            set_value "GAME_B_ENABLED" "false"
            echo -e "${YELLOW}❌ Space Groove Drift disabled${NC}"
            ;;
        c|game-c)
            set_value "GAME_C_ENABLED" "false"
            echo -e "${YELLOW}❌ Groove Arena Overdrive disabled${NC}"
            ;;
        *)
            echo -e "${RED}❌ Unknown game: $game${NC}"
            exit 1
            ;;
    esac
}

enable_all() {
    set_value "GAME_A_ENABLED" "true"
    set_value "GAME_B_ENABLED" "true"
    set_value "GAME_C_ENABLED" "true"
    echo -e "${GREEN}✅ All games enabled${NC}"
}

disable_all() {
    set_value "GAME_A_ENABLED" "false"
    set_value "GAME_B_ENABLED" "false"
    set_value "GAME_C_ENABLED" "false"
    echo -e "${YELLOW}❌ All games disabled${NC}"
}

set_maintenance() {
    local mode=$1
    if [ "$mode" = "on" ]; then
        set_value "MAINTENANCE_MODE" "true"
        echo -e "${RED}🔧 Maintenance mode ENABLED${NC}"
        echo -e "${YELLOW}⚠️  All games are now inaccessible${NC}"
    else
        set_value "MAINTENANCE_MODE" "false"
        echo -e "${GREEN}✅ Maintenance mode DISABLED${NC}"
    fi
}

reload_config() {
    echo -e "${CYAN}🔄 Restarting with new configuration...${NC}"
    
    # Load variables properly (skip comments and empty lines)
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^#.*$ ]] && continue
        [[ -z $key ]] && continue
        # Export the variable
        export "$key=$value"
    done < <(grep -v '^[[:space:]]*#' "$CONFIG_FILE" | grep -v '^[[:space:]]*$')
    
    # Check if docker compose is available
    if command -v docker compose &> /dev/null; then
        echo ""
        echo "Building with environment variables:"
        echo "  GAME_A_ENABLED=${GAME_A_ENABLED}"
        echo "  GAME_B_ENABLED=${GAME_B_ENABLED}"
        echo "  GAME_C_ENABLED=${GAME_C_ENABLED}"
        echo "  MAINTENANCE_MODE=${MAINTENANCE_MODE}"
        echo ""
        
        docker compose up -d --build frontend
        echo -e "${GREEN}✅ Frontend restarted successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker Compose not found${NC}"
        echo "Please restart manually with these variables:"
        echo "  export GAME_A_ENABLED=${GAME_A_ENABLED}"
        echo "  export GAME_B_ENABLED=${GAME_B_ENABLED}"
        echo "  export GAME_C_ENABLED=${GAME_C_ENABLED}"
        echo "  export MAINTENANCE_MODE=${MAINTENANCE_MODE}"
    fi
}

# Parse arguments
case ${1:-} in
    status)
        show_status
        ;;
    enable)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Please specify a game${NC}"
            show_help
            exit 1
        fi
        enable_game "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 Don't forget to run: ./manage-games.sh reload${NC}"
        ;;
    disable)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Please specify a game${NC}"
            show_help
            exit 1
        fi
        disable_game "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 Don't forget to run: ./manage-games.sh reload${NC}"
        ;;
    enable-all)
        enable_all
        show_status
        echo ""
        echo -e "${YELLOW}💡 Don't forget to run: ./manage-games.sh reload${NC}"
        ;;
    disable-all)
        disable_all
        show_status
        echo ""
        echo -e "${YELLOW}💡 Don't forget to run: ./manage-games.sh reload${NC}"
        ;;
    maintenance)
        if [ -z "${2:-}" ]; then
            echo -e "${RED}❌ Please specify on or off${NC}"
            exit 1
        fi
        set_maintenance "$2"
        show_status
        echo ""
        echo -e "${YELLOW}💡 Don't forget to run: ./manage-games.sh reload${NC}"
        ;;
    reload)
        reload_config
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
