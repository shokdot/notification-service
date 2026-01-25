import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from "@core/index.js";

const notifyFriendsStatusChangeSchema: RouteShorthandOptions = {
	preHandler: [serviceAuth],
	schema: {
		description: "Notify friends of user status change (internal use only)",
		tags: ["Internal"],
		body: {
			type: "object",
			required: ["userId", "status"],
			properties: {
				userId: { type: "string" },
				status: { type: "string", enum: ["ONLINE", "IN_GAME", "OFFLINE"] }
			},
			additionalProperties: false
		},
		response: {
			200: {
				type: "object",
				required: ["status", "message"],
				properties: {
					status: { type: "string", enum: ["success"] },
					message: { type: "string" }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default notifyFriendsStatusChangeSchema;
