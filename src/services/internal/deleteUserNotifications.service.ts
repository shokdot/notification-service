import prisma from "../../utils/prismaClient.js";

const deleteUserNotifications = async (userId: string) => {
    await prisma.notification.deleteMany({
        where: { userId },
    });

    await prisma.notificationPreference.deleteMany({
        where: { userId },
    });
};

export default deleteUserNotifications;
