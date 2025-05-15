FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use the Docker-specific environment file
RUN if [ -f .env.docker ]; then cp .env.docker .env; fi

# Development mode
CMD ["npm", "run", "dev"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Use the Docker-specific environment file
RUN if [ -f .env.docker ]; then cp .env.docker .env; fi

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]