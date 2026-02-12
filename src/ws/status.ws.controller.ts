import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { updateStatus } from '@services/status/index.js';
import { authenticateWs, AppError, wsAuthError } from '@core/index.js';
import { statusConnections } from '../wsManager/statusConnections.js';

/** Ping interval to detect stale connections (30 seconds) */
const PING_INTERVAL_MS = 30_000;

const wsStatusHandler = async (ws: WebSocket, request: FastifyRequest) => {
	let userId: string;
	let pingTimer: ReturnType<typeof setInterval> | null = null;

	try {
		// Browser WebSocket API doesn't support custom headers,
		// so accept token from query param as fallback
		const url = new URL(request.url, `http://${request.headers.host}`);
		const queryToken = url.searchParams.get("token");
		const authHeader = request.headers['authorization'] || (queryToken ? `Bearer ${queryToken}` : undefined);

		const authResult = authenticateWs(authHeader, ws);
		userId = authResult.userId;

		// Register connection BEFORE notifying so friends can reach this user immediately
		statusConnections.add(userId, ws);
		await updateStatus(userId, 'ONLINE');

		// Heartbeat: ping the client periodically to detect stale connections
		let isAlive = true;
		ws.on('pong', () => { isAlive = true; });

		pingTimer = setInterval(() => {
			if (!isAlive) {
				// No pong received since last ping — connection is dead
				if (pingTimer) clearInterval(pingTimer);
				ws.terminate();
				return;
			}
			isAlive = false;
			ws.ping();
		}, PING_INTERVAL_MS);

		ws.on('close', async () => {
			if (pingTimer) clearInterval(pingTimer);

			// Only clean up if this is still the active connection for this user.
			// A newer connection may have already replaced this one (e.g. reconnect),
			// in which case we must NOT remove the new connection or set OFFLINE.
			if (statusConnections.get(userId) !== ws) return;

			statusConnections.remove(userId);
			await updateStatus(userId, 'OFFLINE');
		});

		ws.on('error', async (error) => {
			if (pingTimer) clearInterval(pingTimer);
			request.log.error({ userId, event: 'status_ws_error', error: error instanceof Error ? error.message : String(error) }, 'Status WS error');
			if (statusConnections.get(userId) !== ws) return;

			statusConnections.remove(userId);
			await updateStatus(userId, 'OFFLINE');
		});

	} catch (error) {
		if (pingTimer) clearInterval(pingTimer);
		if (error instanceof AppError) {
			wsAuthError(error.code, ws);
		}
		switch ((error as any)?.code) {
			case "USER_NOT_FOUND":
				ws.close(1008, "USER_NOT_FOUND");
				break;
			default:
				ws.close(1011, "INTERNAL_SERVER_ERROR");
				break;
		}
	}
};

export default wsStatusHandler;

