# Frontend Integration Guide — Notification Service

How a **React/Next.js** frontend should use the Notification Service: HTTP API and WebSocket flows.

---

## Base URL and auth

- **Base URL**: `{NOTIFICATION_SERVICE_URL}/api/v1/notifications`
- **Auth**: Send access token (from Auth Service) as `Authorization: Bearer <accessToken>` on every HTTP request and when opening WebSockets.

---

## 1. Get notifications

**Purpose:** Show list of notifications (e.g. bell dropdown or notifications page).

**Request:** `GET /api/v1/notifications`

**Flow:** Call with Bearer token; render `data.results` (id, type, message, isRead, createdAt). Use `data.count` for badge.

---

## 2. Mark as read

**Purpose:** Mark one notification as read when user opens it.

**Request:** `PATCH /api/v1/notifications/:id/read`

**Flow:** Call with Bearer token; on success, update local state (set isRead for that id) and optionally decrement unread count.

---

## 3. Mark all as read

**Purpose:** Mark all notifications as read (e.g. "Mark all read" button).

**Request:** `PATCH /api/v1/notifications/read-all`

**Flow:** Call with Bearer token; on success, set all notifications as read in UI and clear unread count.

---

## 4. Delete notification

**Purpose:** Remove a notification.

**Request:** `DELETE /api/v1/notifications/:id`

**Flow:** Call with Bearer token; on success, remove that notification from UI.

---

## 5. Real-time notifications (WebSocket)

**Purpose:** Receive new notifications without polling.

**URL:** `ws://{host}:{port}/api/v1/notifications/ws` (use `wss://` in production)

**Auth:** Bearer token via `Authorization` header OR `?token=<accessToken>` query parameter. The query parameter approach is required for browser WebSocket connections since the browser WebSocket API does not support custom headers.

**Flow:** Open WebSocket with token. On message, parse JSON (`{ id, type, message, createdAt }`) and add/update notification in UI (e.g. toast or list). On close/error, reconnect after a delay (optionally refresh token first).

---

## 6. Real-time status (WebSocket)

**Purpose:** Receive friends' online/offline (or similar) status updates.

**URL:** `ws://{host}:{port}/api/v1/notifications/status/ws` (use `wss://` in production)

**Auth:** Bearer token via `Authorization` header OR `?token=<accessToken>` query parameter.

**Message format:** `{ type: "friend-status-changed", data: { userId, status, timestamp } }` where `status` is `"ONLINE"`, `"IN_GAME"`, or `"OFFLINE"`.

**Flow:** Open WebSocket with token. On connect, the backend sets the user's status to `ONLINE`. On message, parse JSON and update the relevant friend's status indicator in the UI. On disconnect, the backend sets the user's status to `OFFLINE` and notifies their friends.

---

## Quick reference

| User action           | Request                               | Then                    |
|-----------------------|----------------------------------------|-------------------------|
| Load notifications    | `GET /notifications`                   | Render list + count     |
| Mark one read         | `PATCH /notifications/:id/read`        | Update UI               |
| Mark all read         | `PATCH /notifications/read-all`        | Clear unread            |
| Delete notification   | `DELETE /notifications/:id`            | Remove from list        |
| Real-time new         | WebSocket `/notifications/ws`          | Push to list / toast    |
| Real-time status      | WebSocket `/notifications/status/ws`   | Update status indicators |

Use the same access token as for Auth Service; on 401, refresh token and retry.
