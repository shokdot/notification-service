# Notification Service

Notification microservice for the ft_transcendence platform. Handles in-app notifications (list, mark read, mark all read, delete) and WebSocket streams for real-time notifications and status updates.

## Features

- **HTTP API**: Get notifications, mark one/all as read, delete notification (Bearer auth)
- **WebSocket**: Real-time notifications (`/ws`), status updates (`/status/ws`) with Bearer auth
- **Internal API**: Create, send to user, broadcast, notify friends status change (service token)

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5 + WebSocket
- **ORM**: Prisma (SQLite)
- **Auth**: JWT Bearer (external), service token (internal)

## Quick Start

### Prerequisites

- Node.js 20+
- Environment variables (see [Environment](#environment))

### Install & Run

```bash
npm install
npm run dev
```

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start` (production)

Service listens on `HOST:PORT` (default `0.0.0.0:3002`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable             | Required | Description                    |
|----------------------|----------|--------------------------------|
| `PORT`               | No       | Server port (default: 3002)    |
| `HOST`               | No       | Bind address (default: 0.0.0.0)|
| `USER_SERVICE_URL`   | Yes      | User service base URL          |
| `SERVICE_TOKEN`      | Yes      | Service-to-service token       |
| `JWT_SECRET`         | Yes      | Access token verification      |
| `JWT_REFRESH_SECRET` | Yes      | Refresh token (if needed)      |
| `JWT_TWO_FA`         | Yes      | 2FA token (if needed)          |

API prefix defaults to `/api/v1` (from core).

## API Base URL

- **HTTP (frontend):** `GET /api/v1/notifications`, `PATCH /:id/read`, `PATCH /read-all`, `DELETE /:id`
- **WebSocket:** `GET /api/v1/notifications/ws`, `GET /api/v1/notifications/status/ws` — **Auth: Bearer**
- **Internal:** `POST /api/v1/notifications/internal/...` (service token)

## Documentation

- **[API Endpoints](docs/api-endpoints.md)** — HTTP endpoints, WebSocket URLs, internal API.
- **[Frontend Integration Guide](docs/frontend-integration-guide.md)** — Flows and usage from React/Next.js.

## Project Structure

```
src/
├── controllers/   # external (get, markRead, markAllRead, delete), internal
├── services/      # notification, status, internal
├── ws/            # notification.ws.controller, status.ws.controller
├── wsManager/     # socket instances, status connections
├── routes/        # notify, ws, internal
├── schemas/       # Validation
├── dto/           # Data transfer types
└── utils/         # env, prisma
prisma/
└── schema.prisma
```

## License

Part of ft_transcendence project.
