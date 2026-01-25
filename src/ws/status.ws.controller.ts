import { FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { updateStatus } from '@services/status/index.js';
import { authenticateWs, AppError, wsAuthError } from '@core/index.js';
import { statusConnections } from '../wsManager/statusConnections.js';

const wsStatusHandler = async (ws: WebSocket, request: FastifyRequest) => {
	let userId: string;

	try {
		const authResult = authenticateWs(request.headers['authorization'], ws);
		userId = authResult.userId;

		await updateStatus(userId, 'ONLINE');
		statusConnections.add(userId, ws);

		ws.on('close', async () => {
			statusConnections.remove(userId);
			await updateStatus(userId, 'OFFLINE');
		});

		ws.on('error', async (error) => {
			request.log.error({ userId, event: 'status_ws_error', error: error instanceof Error ? error.message : String(error) }, 'Status WS error');
			statusConnections.remove(userId);
			await updateStatus(userId, 'OFFLINE');
		});

	} catch (error) {
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

