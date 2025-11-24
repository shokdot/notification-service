import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { notificationSockets } from "src/wsManager/socketInstances.service.js";
import authenticateWs from "@core/utils/authenticate.ws.js";
import { AppError } from "@core/utils/AppError.js";

const wsNotificationHandler = async (ws: WebSocket, request: FastifyRequest) => {
	try {
		const authResult = authenticateWs(request.headers["authorization"], ws);

		const { userId } = authResult;

		notificationSockets.add(userId, ws);

		ws.on("close", () => {
			notificationSockets.remove(userId);
		});

	} catch (error) { // check it full
		if (error instanceof AppError) { // change it // separate wsAuthError
			switch (error.code) {
				case 'ACCESS_TOKEN_MISSING':
					ws.close(1008, 'ACCESS_TOKEN_MISSING');
					break;
				case 'INVALID_ACCESS_TOKEN':
					ws.close(1008, 'INVALID_ACCESS_TOKEN');
					break;
				default: // no need this
					ws.close(1011, "INTERNAL_SERVER_ERROR");
			}
		}
	}
};

export default wsNotificationHandler;
