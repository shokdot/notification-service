import axios from 'axios';
import { statusConnections } from 'src/wsManager/statusConnections.js';
import { USER_SERVICE_URL, CHAT_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';

const notifyFriendsStatusChange = async (userId: string, newStatus: string): Promise<void> => {
	try {
		// Fetch friend IDs and conversation partner IDs in parallel
		const [friendsResponse, chatResponse] = await Promise.all([
			axios.get(
				`${USER_SERVICE_URL}/internal/${userId}/friends`,
				{ headers: { "x-service-token": SERVICE_TOKEN } }
			),
			axios.get(
				`${CHAT_SERVICE_URL}/internal/${userId}/conversation-partners`,
				{ headers: { "x-service-token": SERVICE_TOKEN } }
			).catch(() => null), // Don't fail if chat service is unavailable
		]);

		const friendIds: string[] = friendsResponse.data.data.friendIds;
		const chatPartnerIds: string[] = chatResponse?.data?.data?.partnerIds ?? [];

		// Combine and deduplicate — notify all unique users
		const allIds = [...new Set([...friendIds, ...chatPartnerIds])];

		if (allIds.length === 0) {
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

		statusConnections.sendToMany(allIds, notification);

	} catch (error) {
		console.error(`[Status] Error notifying friends for user ${userId}:`, error);
	}
};

export default notifyFriendsStatusChange;
