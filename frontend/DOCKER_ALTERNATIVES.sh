# Option 1: Build localement puis Docker (Recommandé si problème yarn.lock)
# ============================================================================

# Étape 1: Builder localement (sur votre machine avec Node.js)
cd frontend
yarn install
yarn build

# Étape 2: Dockerfile simplifié qui copie juste le build
cat > Dockerfile.prebuild << 'EOF'
FROM nginx:alpine

# Copy pre-built files
COPY build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

# Étape 3: Build Docker
docker build -f Dockerfile.prebuild -t spacegroove-frontend .

# Option 2: Docker multi-stage avec fallback
# ============================================================================

cat > Dockerfile.fallback << 'EOF'
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json
COPY package.json ./

# Try to copy yarn.lock, create if not exists
RUN if [ -f yarn.lock ]; then \
      echo "Using existing yarn.lock"; \
    else \
      echo "Creating new yarn.lock"; \
      touch yarn.lock; \
    fi

# Copy yarn.lock if exists
COPY yarn.lock* ./

# Install with fallback
RUN yarn install --frozen-lockfile || \
    (echo "Frozen lockfile failed, installing normally..." && yarn install)

# Copy all source
COPY . .

# Build
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Option 3: Utiliser npm au lieu de yarn (si yarn.lock pose problème)
# ============================================================================

cat > Dockerfile.npm << 'EOF'
FROM node:20-alpine AS build

WORKDIR /app

# Use npm instead of yarn
COPY package.json package-lock.json* ./

# Install with npm
RUN npm ci || npm install

# Copy source
COPY . .

# Build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
