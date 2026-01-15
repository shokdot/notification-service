import axios from "axios";
import { USER_SERVICE_URL, SERVICE_TOKEN } from "src/utils/env.js";

const updateStatus = async (userId: string, status: "ONLINE" | "OFFLINE" | "IN_GAME") => {
	try {
		const response = await axios.patch(`${USER_SERVICE_URL}/${userId}/status`,
			{ status },
			{
				headers: {
					"Content-Type": "application/json",
					"x-service-token": SERVICE_TOKEN
				}
			}
		);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export default updateStatus;
