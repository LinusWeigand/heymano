# ------------------ 1. BUILD NEXT.JS FRONTEND -------------------
FROM node:18-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .

RUN npm run build

# ------------------ 2. FINAL STAGE: RUN EVERYTHING --------------
FROM node:18-bullseye-slim AS final

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y nginx netcat wget && \
    rm -rf /var/lib/apt/lists/*

RUN wget https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.10.0/cloud-sql-proxy.linux.amd64 -O /usr/local/bin/cloud-sql-proxy && \
    chmod +x /usr/local/bin/cloud-sql-proxy

COPY startup.sh .
RUN chmod +x ./startup.sh

COPY ./backend/target/x86_64-unknown-linux-gnu/release/mano ./backend

COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public

RUN npm ci --omit=dev

COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

ARG DATABASE_URL
ARG URL
ARG DOMAIN
ARG SMTP_EMAIL
ARG SMTP_PASSWORD
ARG DB_CONNECTION_NAME

ENV DATABASE_URL=$DATABASE_URL
ENV URL=$URL
ENV DOMAIN=$DOMAIN
ENV SMTP_EMAIL=$SMTP_EMAIL
ENV SMTP_PASSWORD=$SMTP_PASSWORD
ENV PORT=3000
ENV NODE_ENV=production

CMD ["./startup.sh"]
