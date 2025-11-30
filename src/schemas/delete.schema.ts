import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from '@core/schemas/error.schema.js'
import authenticate from '@core/middlewares/authenticate.middleware.js';

const deleteNotificationSchema: RouteShorthandOptions =
{
	preHandler: [authenticate],
	schema:
	{
		description: "Delete Notification",
		tags: ["Notification"],
		params: {
			type: 'object',
			required: ['id'],
			additionalProperties: false,
			properties: {
				id: { type: 'string', format: 'uuid' },
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

export default deleteNotificationSchema;
