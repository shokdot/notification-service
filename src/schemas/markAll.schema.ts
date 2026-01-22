import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, authenticate } from '@core/index.js'

const markAllReadSchema: RouteShorthandOptions = {
	preHandler: [authenticate],
	schema: {
		description: "Mark all notifications as read",
		tags: ["Notification"],
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

export default markAllReadSchema;
