# Etapa 1: build
FROM node:23 AS builder

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
RUN yarn install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto (usará tsconfig.build.json automáticamente)
RUN yarn build

# Etapa 2: imagen final
FROM node:23-alpine AS runtime

WORKDIR /app

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/src/main"]
