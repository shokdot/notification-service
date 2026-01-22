import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from '@core/index.js'

const createNotificationSchema: RouteShorthandOptions =
{
	preHandler: [serviceAuth],
	schema:
	{
		description: "Create Notification",
		tags: ["Internal"],
		body: {
			type: 'object',
			required: ['userId', 'type', 'message'],
			additionalProperties: false,
			properties: {
				userId: { type: 'string', format: 'uuid' },
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
			404: errorResponseSchema,
			500: errorResponseSchema
		},
	},
};

export default createNotificationSchema;
