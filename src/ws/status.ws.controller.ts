import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { updateStatus } from '@services/status/index.js';
import authenticateWs from '@core/utils/authenticate.ws.js'

const wsStatusHandler = async (ws: WebSocket, request: FastifyRequest) => {
	try {

		const authResult = authenticateWs(request.headers['authorization'], ws);

		const { token } = authResult;

		await updateStatus(token, 'ONLINE');

		ws.on('close', async () => {
			await updateStatus(token, 'OFFLINE');
		})

	} catch (error) {
		switch (error.code) {
			case 'ACCESS_TOKEN_MISSING': // separate wsAuthError
				ws.close(1008, 'ACCESS_TOKEN_MISSING');
				break;
			case 'INVALID_ACCESS_TOKEN':
				ws.close(1008, 'INVALID_ACCESS_TOKEN');
				break;
			case "USER_NOT_FOUND":
				ws.close(1008, "USER_NOT_FOUND");
				break;
			default: // no need this
				ws.close(1011, "INTERNAL_SERVER_ERROR");
		}
	}
};



export default wsStatusHandler;
