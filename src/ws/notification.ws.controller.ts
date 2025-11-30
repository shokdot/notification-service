import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { notificationSockets } from "src/wsManager/socketInstances.js";
import authenticateWs from "@core/utils/authenticate.ws.js";
import { AppError } from "@core/utils/AppError.js";
import wsAuthError from "@core/utils/wsAuthError.js";

const wsNotificationHandler = async (ws: WebSocket, request: FastifyRequest) => {
	try {
		const authResult = authenticateWs(request.headers["authorization"], ws);

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
