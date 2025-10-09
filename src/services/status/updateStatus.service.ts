import axios from "axios";
import { USER_SERVICE_URL } from "src/utils/env.js";

const updateStatus = async (token: string, status: "ONLINE" | "OFFLINE") => {
	try {
		const response = await axios.patch(`${USER_SERVICE_URL}/me/status`,
			{ status },
			{ headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` } });

		return response.data;
	} catch (error) {
		throw error;
	}
};

export default updateStatus;
