# ---------------------------
# Stage 1: Install dependencies
# ---------------------------
FROM node:22 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install


# ---------------------------
# Stage 2: Build Next.js
# ---------------------------
FROM node:22 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_STRAPI_URL
ARG RESEND_API_KEY
ARG RESEND_FROM
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_LOGO_PATH
ARG TURNSTILE_SECRET_KEY
ARG PUPPETEER_SKIP_DOWNLOAD
ARG NODE_ENV

ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RESEND_FROM=$RESEND_FROM
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_LOGO_PATH=$NEXT_LOGO_PATH
ENV TURNSTILE_SECRET_KEY=$TURNSTILE_SECRET_KEY
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ---------------------------
# Stage 3: Runner (PRODUCTION)
# ---------------------------
FROM node:22-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# ⭐ INSTALL CHROMIUM + REQUIRED LIBRARIES
RUN apt-get update && apt-get install -y \
    chromium \
    libnspr4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    libxshmfence1 \
    fonts-liberation \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]