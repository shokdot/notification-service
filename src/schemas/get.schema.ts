import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from '@core/schemas/error.schema.js';
import authenticate from '@core/middlewares/authenticate.middleware.js';

const getNotificationsSchema: RouteShorthandOptions = {
	preHandler: [authenticate],
	schema: {
		description: "Get Notifications",
		tags: ["Notification"],
		response: {
			200: {
				type: 'object',
				required: ['status', 'data', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' },
					data: {
						type: 'object',
						required: ['count', 'results'],
						additionalProperties: false,
						properties: {
							count: { type: 'number' },
							results: {
								type: 'array',
								items: {
									type: 'object',
									required: ['id', 'type', 'message', 'isRead', 'createdAt'],
									additionalProperties: false,
									properties: {
										id: { type: 'string' },
										type: { type: 'string' },
										message: { type: 'string' },
										isRead: { type: 'boolean' },
										createdAt: { type: 'string', format: 'date-time' }
									}
								}
							}
						}
					}
				}
			},
			401: errorResponseSchema,
			403: errorResponseSchema,
			404: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default getNotificationsSchema;
