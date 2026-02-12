import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, authenticate } from '@core/index.js'

const getPreferencesSchema: RouteShorthandOptions = {
	preHandler: [authenticate],
	schema: {
		description: "Get notification preferences for the current user",
		tags: ["Notification"],
		response: {
			200: {
				type: 'object',
				required: ['status', 'data'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'object',
						required: ['gameInvites', 'friendRequests', 'matchResults', 'systemUpdates', 'sounds'],
						additionalProperties: false,
						properties: {
							gameInvites: { type: 'boolean' },
							friendRequests: { type: 'boolean' },
							matchResults: { type: 'boolean' },
							systemUpdates: { type: 'boolean' },
							sounds: { type: 'boolean' }
						}
					}
				}
			},
			401: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default getPreferencesSchema;
