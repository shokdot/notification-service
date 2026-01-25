import axios from 'axios';
import { statusConnections } from 'src/wsManager/statusConnections.js';
import { USER_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';

const notifyFriendsStatusChange = async (userId: string, newStatus: string): Promise<void> => {
	try {
		const response = await axios.get(
			`${USER_SERVICE_URL}/internal/${userId}/friends`,
			{
				headers: {
					"x-service-token": SERVICE_TOKEN
				}
			}
		);

		const friendIds: string[] = response.data.data.friendIds;

		if (friendIds.length === 0) {
			return;
		}

		const notification = {
			type: 'friend-status-changed',
			data: {
				userId,
				status: newStatus,
				timestamp: new Date().toISOString()
			}
		};

		statusConnections.sendToMany(friendIds, notification);

	} catch (error) {
		console.error(`[Status] Error notifying friends for user ${userId}:`, error);
	}
};

export default notifyFriendsStatusChange;
