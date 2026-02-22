# Notification Service

> Part of the [ft_transcendence](https://github.com/shokdot/ft_transcendence) project.

Notification microservice. Handles in-app notifications (list, mark read, delete) and preference settings. Provides WebSocket streams for real-time push notifications and user presence/status updates. Internal API for other services to create and broadcast notifications.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5 + WebSocket
- **ORM**: Prisma (SQLite)
- **Auth**: JWT Bearer (external), service token (internal)

## Quick Start

```bash
npm install
npm run dev
```

Service listens on `HOST:PORT` (default `0.0.0.0:3002`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable             | Required | Description                      |
|----------------------|----------|----------------------------------|
| `PORT`               | No       | Server port (default: 3002)      |
| `HOST`               | No       | Bind address (default: 0.0.0.0)  |
| `USER_SERVICE_URL`   | Yes      | User service base URL            |
| `SERVICE_TOKEN`      | Yes      | Service-to-service token         |
| `JWT_SECRET`         | Yes      | Access token verification        |

---

## API Endpoints

Base URL: **`{NOTIFICATION_SERVICE_URL}/api/v1/notifications`**

All external endpoints use **Bearer** access token in `Authorization` header.

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": null
  }
}
```

---

### HTTP Endpoints

#### `GET /`

Get all notifications for the current user. **Auth: Bearer**

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "count": 2,
    "results": [
      {
        "id": "uuid",
        "type": "string",
        "message": "string",
        "isRead": false,
        "createdAt": "date-time"
      }
    ]
  }
}
```

---

#### `PATCH /:id/read`

Mark a single notification as read. **Auth: Bearer**

**Params:** `id` — Notification ID (uuid)

**Success (200):** `{ "status": "success", "message": "..." }`

---

#### `PATCH /read-all`

Mark all notifications as read for the current user. **Auth: Bearer**

**Success (200):** `{ "status": "success", "message": "..." }`

---

#### `DELETE /:id`

Delete a notification. **Auth: Bearer**

**Params:** `id` — Notification ID (uuid)

**Success (200):** `{ "status": "success", "message": "..." }`

---

#### `GET /preferences`

Get notification preferences. **Auth: Bearer**

Defaults if not yet saved: `gameInvites: true`, `friendRequests: true`, `matchResults: true`, `systemUpdates: false`, `sounds: true`.

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "gameInvites": true,
    "friendRequests": true,
    "matchResults": true,
    "systemUpdates": false,
    "sounds": true
  }
}
```

---

#### `PUT /preferences`

Update notification preferences. **Auth: Bearer**

All fields are optional; only provided fields are updated.

**Body:**

```json
{
  "gameInvites": true,
  "friendRequests": true,
  "matchResults": true,
  "systemUpdates": false,
  "sounds": true
}
```

**Success (200):** `{ "status": "success", "message": "..." }`

---

### WebSocket

#### `GET /ws` (WebSocket Upgrade)

Real-time notifications stream. **Auth:** Bearer via `Authorization` header or `?token=<accessToken>` query param.

**URL:** `ws://{host}:{port}/api/v1/notifications/ws`

On connect, server pushes unread or new notifications. Message format: `{ id, type, message, createdAt }`.

---

#### `GET /status/ws` (WebSocket Upgrade)

Real-time presence/status updates (friends online/offline/in-game). **Auth:** Bearer via `Authorization` header or `?token=<accessToken>` query param.

**URL:** `ws://{host}:{port}/api/v1/notifications/status/ws`

---

### Internal API (backend only)

Endpoints under `/internal`: create notification, send to user, broadcast, notify friends of status change.

**Auth:** Service token (`x-service-token` header). Not for frontend use.

---

### Summary

| Method    | Path             | Auth    | Purpose                   |
|-----------|------------------|---------|---------------------------|
| GET       | `/`              | Bearer  | Get notifications         |
| PATCH     | `/:id/read`      | Bearer  | Mark one as read          |
| PATCH     | `/read-all`      | Bearer  | Mark all as read          |
| DELETE    | `/:id`           | Bearer  | Delete notification       |
| GET       | `/preferences`   | Bearer  | Get preferences           |
| PUT       | `/preferences`   | Bearer  | Update preferences        |
| WebSocket | `/ws`            | Bearer  | Real-time notifications   |
| WebSocket | `/status/ws`     | Bearer  | Real-time status updates  |
| HTTP      | `/internal/...`  | Service | Internal (backend only)   |
