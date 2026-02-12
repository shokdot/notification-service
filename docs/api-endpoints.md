# Notification Service — API Endpoints

Base URL: **`{NOTIFICATION_SERVICE_URL}/api/v1/notifications`**

All external HTTP and WebSocket endpoints use **Bearer** access token in `Authorization` header.

---

## Error response format

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

## HTTP API

### GET `/`

Get notifications for the current user. **Auth: Bearer**

**Success (200):**

```json
{
  "status": "success",
  "message": "string",
  "data": {
    "count": number,
    "results": [
      {
        "id": "string",
        "type": "string",
        "message": "string",
        "isRead": boolean,
        "createdAt": "date-time"
      }
    ]
  }
}
```

---

### PATCH `/:id/read`

Mark a single notification as read. **Auth: Bearer**

**Params:** `id` — Notification ID (uuid)

**Success (200):** `{ "status": "success", "message": "string" }`

---

### PATCH `/read-all`

Mark all notifications as read for the current user. **Auth: Bearer**

**Success (200):** `{ "status": "success", "message": "string" }`

---

### DELETE `/:id`

Delete a notification. **Auth: Bearer**

**Params:** `id` — Notification ID (uuid)

**Success (200):** `{ "status": "success", "message": "string" }`

---

### GET `/preferences`

Get notification preferences for the current user. **Auth: Bearer**

If no preferences have been saved yet, returns defaults: `gameInvites: true`, `friendRequests: true`, `matchResults: true`, `systemUpdates: false`, `sounds: true`.

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

### PUT `/preferences`

Update notification preferences for the current user. **Auth: Bearer**

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

**Success (200):** `{ "status": "success", "message": "string" }`

---

## WebSocket

### GET `/ws` (WebSocket)

Real-time notifications stream. **Auth:** Bearer token via `Authorization` header OR `?token=<accessToken>` query parameter.

**URL:** `ws://{host}:{port}/api/v1/notifications/ws` (or `wss://` in production)

**Connection:** On connect, server may push new notifications. Message format: `{ id, type, message, createdAt }`.

---

### GET `/status/ws` (WebSocket)

Real-time status updates (e.g. friends online/offline). **Auth:** Bearer token via `Authorization` header OR `?token=<accessToken>` query parameter.

**URL:** `ws://{host}:{port}/api/v1/notifications/status/ws` (or `wss://` in production)

**Connection:** On connect, server may push status change events. Message format is service-specific.

---

## Internal API (backend only)

Endpoints under `/internal` (create, send to user, broadcast, notify friends status change). **Auth:** Service token. Not for frontend.

---

## Summary

| Method      | Path           | Auth   | Purpose                |
|-------------|----------------|--------|------------------------|
| GET         | `/`            | Bearer | Get notifications      |
| PATCH       | `/:id/read`    | Bearer | Mark one as read       |
| PATCH       | `/read-all`    | Bearer | Mark all as read       |
| DELETE      | `/:id`         | Bearer | Delete notification    |
| GET         | `/preferences` | Bearer | Get preferences        |
| PUT         | `/preferences` | Bearer | Update preferences     |
| WebSocket   | `/ws`          | Bearer | Real-time notifications |
| WebSocket   | `/status/ws`   | Bearer | Real-time status       |
