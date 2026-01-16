import { FastifyInstance } from "fastify";
import wsRoutes from "./ws.routes.js";
import notifyRoutes from "./notify.routes.js";
import internalRoutes from "./internal.routes.js";

export default async function notificationRoutes(app: FastifyInstance): Promise<void> {
	app.register(notifyRoutes);
	app.register(wsRoutes);
	app.register(internalRoutes, { prefix: "/internal" });
}
