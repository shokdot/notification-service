import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, authenticate } from '@core/index.js'

const updatePreferencesSchema: RouteShorthandOptions = {
	preHandler: [authenticate],
	schema: {
		description: "Update notification preferences for the current user",
		tags: ["Notification"],
		body: {
			type: 'object',
			additionalProperties: false,
			properties: {
				gameInvites: { type: 'boolean' },
				friendRequests: { type: 'boolean' },
				matchResults: { type: 'boolean' },
				systemUpdates: { type: 'boolean' },
				sounds: { type: 'boolean' }
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
			500: errorResponseSchema
		}
	}
};

export default updatePreferencesSchema;
