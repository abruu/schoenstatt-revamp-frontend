# Stage 1: Install dependencies
FROM node:22 AS deps
WORKDIR /app
COPY package.json ./
RUN npm install


# Stage 2: Build the Next.js app
FROM node:22 AS builder
WORKDIR /app

# Accept environment variables from Railway at build time
ARG NEXT_PUBLIC_STRAPI_URL
ARG RESEND_API_KEY
ARG RESEND_FROM
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_LOGO_PATH
ARG TURNSTILE_SECRET_KEY
ARG PUPPETEER_SKIP_DOWNLOAD
ARG NODE_ENV

# Promote them to ENV so Next.js can read them
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RESEND_FROM=$RESEND_FROM
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_LOGO_PATH=$NEXT_LOGO_PATH
ENV TURNSTILE_SECRET_KEY=$TURNSTILE_SECRET_KEY
ENV PUPPETEER_SKIP_DOWNLOAD=$PUPPETEER_SKIP_DOWNLOAD

# Copy deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build Next.js (now env vars are available)
RUN npm run build


# Stage 3: Run the app
FROM node:22 AS runner
WORKDIR /app

ENV NODE_ENV=$NODE_ENV
ENV PORT=3000

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
