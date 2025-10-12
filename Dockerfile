FROM node:20 AS builder

WORKDIR /apps

COPY core core
COPY notification-service notification-service

WORKDIR /apps/core
RUN npm install && npm run build

WORKDIR /apps/notification-service
RUN npm install

COPY notification-service/prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /apps

# Copy only the dist files needed for runtime
COPY --from=builder /apps/core/dist core/dist
COPY --from=builder /apps/notification-service/dist notification-service/dist
COPY --from=builder /apps/notification-service/package*.json notification-service/
COPY --from=builder /apps/notification-service/prisma notification-service/prisma

WORKDIR /apps/notification-service

RUN npm install --omit=dev

RUN npx prisma generate

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
