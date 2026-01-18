FROM node:20 AS builder

WORKDIR /apps

COPY core/package*.json core/
COPY core/tsconfig.json core/
COPY core/src core/src

WORKDIR /apps/core
RUN npm install && npm run build

WORKDIR /apps

COPY notification-service/package*.json notification-service/
COPY notification-service/prisma.config.ts notification-service/
COPY notification-service/tsconfig.json notification-service/
COPY notification-service/tsup.config.ts notification-service/
COPY notification-service/prisma notification-service/prisma
COPY notification-service/src notification-service/src

WORKDIR /apps/notification-service

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /apps

COPY --from=builder /apps/core/dist core/dist
COPY --from=builder /apps/notification-service/dist notification-service/dist
COPY --from=builder /apps/notification-service/package*.json notification-service/
COPY --from=builder /apps/notification-service/prisma.config.ts notification-service/
COPY --from=builder /apps/notification-service/prisma notification-service/prisma

WORKDIR /apps/notification-service

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
