import { WebSocket } from "ws";

/**
 * Simple in-memory connection manager for status WebSocket connections
 */
class StatusConnectionManager {
	private connections = new Map<string, WebSocket>();

	/**
	 * Add a user's WebSocket connection
	 */
	add(userId: string, ws: WebSocket): void {
		this.connections.set(userId, ws);
	}

	/**
	 * Remove a user's WebSocket connection
	 */
	remove(userId: string): void {
		this.connections.delete(userId);
	}

	/**
	 * Get a user's WebSocket connection
	 */
	get(userId: string): WebSocket | undefined {
		return this.connections.get(userId);
	}

	/**
	 * Check if a user is connected
	 */
	has(userId: string): boolean {
		return this.connections.has(userId);
	}

	/**
	 * Send a message to a specific user
	 */
	send(userId: string, data: any): boolean {
		const ws = this.get(userId);
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(data));
			return true;
		}
		return false;
	}

	/**
	 * Send a message to multiple users
	 */
	sendToMany(userIds: string[], data: any): void {
		userIds.forEach(userId => {
			this.send(userId, data);
		});
	}

	/**
	 * Get all connected user IDs
	 */
	getAllUserIds(): string[] {
		return Array.from(this.connections.keys());
	}
}

export const statusConnections = new StatusConnectionManager();
