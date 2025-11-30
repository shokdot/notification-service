import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from '@core/schemas/error.schema.js';
import authenticate from '@core/middlewares/authenticate.middleware.js';

const markReadSchema: RouteShorthandOptions = {
	preHandler: [authenticate],
	schema: {
		description: "Mark a single notification as read",
		tags: ["Notification"],
		params: {
			type: 'object',
			required: ['id'],
			additionalProperties: false,
			properties: {
				id: { type: 'string', description: "Notification ID" }
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' }
				}
			},
			401: errorResponseSchema,
			403: errorResponseSchema,
			404: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default markReadSchema;
