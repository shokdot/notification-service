import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { notificationSockets } from "src/wsManager/socketInstances.js";
import { authenticateWs, AppError, wsAuthError } from "@core/index.js";

const wsNotificationHandler = async (ws: WebSocket, request: FastifyRequest) => {
	try {
		// Browser WebSocket API doesn't support custom headers,
		// so accept token from query param as fallback
		const url = new URL(request.url, `http://${request.headers.host}`);
		const queryToken = url.searchParams.get("token");
		const authHeader = request.headers["authorization"] || (queryToken ? `Bearer ${queryToken}` : undefined);

		const authResult = authenticateWs(authHeader, ws);

		const { userId } = authResult;

		notificationSockets.add(userId, ws);

		ws.on("close", () => {
			notificationSockets.remove(userId);
		});

	} catch (error) {
		if (error instanceof AppError)
			wsAuthError(error.code, ws);

		ws.close(1011, "INTERNAL_SERVER_ERROR");
	}
};

export default wsNotificationHandler;
