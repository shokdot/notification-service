import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { notificationSockets } from "src/wsManager/socketInstances.js";
import { authenticateWs, AppError, wsAuthError } from "@core/index.js";

/** Ping interval to detect stale connections (30 seconds) */
const PING_INTERVAL_MS = 30_000;

const wsNotificationHandler = async (ws: WebSocket, request: FastifyRequest) => {
	let pingTimer: ReturnType<typeof setInterval> | null = null;

	try {
		// Browser WebSocket API doesn't support custom headers,
		// so accept token from query param as fallback
		const url = new URL(request.url, `http://${request.headers.host}`);
		const queryToken = url.searchParams.get("token");
		const authHeader = request.headers["authorization"] || (queryToken ? `Bearer ${queryToken}` : undefined);

		const authResult = authenticateWs(authHeader, ws);

		const { userId } = authResult;

		notificationSockets.add(userId, ws);

		// Heartbeat: ping the client periodically to detect stale connections
		let isAlive = true;
		ws.on('pong', () => { isAlive = true; });

		pingTimer = setInterval(() => {
			if (!isAlive) {
				if (pingTimer) clearInterval(pingTimer);
				ws.terminate();
				return;
			}
			isAlive = false;
			ws.ping();
		}, PING_INTERVAL_MS);

		ws.on("close", () => {
			if (pingTimer) clearInterval(pingTimer);
			// Only remove if this is still the active connection for this user.
			// A newer connection may have already replaced this one on reconnect.
			if (notificationSockets.get(userId) === ws) {
				notificationSockets.remove(userId);
			}
		});

	} catch (error) {
		if (pingTimer) clearInterval(pingTimer);
		if (error instanceof AppError)
			wsAuthError(error.code, ws);

		ws.close(1011, "INTERNAL_SERVER_ERROR");
	}
};

export default wsNotificationHandler;
