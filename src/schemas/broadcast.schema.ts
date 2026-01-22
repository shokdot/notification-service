import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from '@core/index.js'

const broadcastNotificationSchema: RouteShorthandOptions =
{
	preHandler: [serviceAuth],
	schema:
	{
		description: "Create Notification",
		tags: ["Internal"],
		body: {
			type: 'object',
			required: ['type', 'message'],
			additionalProperties: false,
			properties: {
				type: { type: 'string' },
				message: { type: 'string' }
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
				},
			},

			401: errorResponseSchema,
			403: errorResponseSchema,
			500: errorResponseSchema
		},
	},
};

export default broadcastNotificationSchema;
