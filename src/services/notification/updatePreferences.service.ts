import prisma from "src/utils/prismaClient.js";
import UpdatePreferencesDTO from "src/dto/preferences.dto.js";

const updatePreferences = async (userId: string, data: UpdatePreferencesDTO) => {
	await prisma.notificationPreference.upsert({
		where: { userId },
		create: { userId, ...data },
		update: data,
	});
};

export default updatePreferences;
