FROM node:20 AS builder

WORKDIR /app

COPY apps/core ./apps/core
COPY apps/notification-service ./apps/notification-service

WORKDIR /app/apps/core
RUN npm install && npm run build

WORKDIR /app/apps/notification-service
RUN npm install
COPY apps/notification-service/prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the dist files needed for runtime
COPY --from=builder /app/apps/core/dist ./apps/core/dist
COPY --from=builder /app/apps/notification-service/dist ./apps/notification-service/dist
COPY --from=builder /app/apps/notification-service/package*.json ./apps/notification-service/
COPY --from=builder /app/apps/notification-service/prisma ./apps/notification-service/prisma

WORKDIR /app/apps/notification-service

RUN npm install --omit=dev

RUN npx prisma generate

EXPOSE 3001
CMD ["node", "dist/server.js"]
