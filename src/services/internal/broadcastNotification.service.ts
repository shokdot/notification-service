import { notificationSockets } from "src/wsManager/socketInstances.js";

const broadcastNotification = async (type: string, message: any) => {

    notificationSockets.broadcast({
        type,
        message,
        createdAt: new Date(),
    });

}

export default broadcastNotification;
