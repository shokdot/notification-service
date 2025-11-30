import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { updateStatus } from '@services/status/index.js';
import authenticateWs from '@core/utils/authenticate.ws.js'
import { AppError } from "@core/utils/AppError.js";
import wsAuthError from "@core/utils/wsAuthError.js";

const wsStatusHandler = async (ws: WebSocket, request: FastifyRequest) => {
	try {

		const authResult = authenticateWs(request.headers['authorization'], ws);

		const { token } = authResult;

		await updateStatus(token, 'ONLINE');

		ws.on('close', async () => {
			await updateStatus(token, 'OFFLINE');
		})

	} catch (error) {
		if (error instanceof AppError) {
			wsAuthError(error.code, ws);
		}
		switch (error.code) {
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
