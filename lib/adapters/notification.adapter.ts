/**
 * Notification adapter interface
 * Provides notification capabilities for future integrations
 */

export interface NotificationPayload {
  title: string;
  message: string;
  level?: "info" | "warning" | "error" | "success";
  metadata?: Record<string, any>;
}

export interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<void>;
}

/**
 * Console Notification Adapter (stub implementation for development)
 */
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    const { title, message, level = "info", metadata } = payload;

    const prefix = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    }[level];

    console.log(`${prefix} [NOTIFICATION] ${title}`);
    console.log(`   ${message}`);

    if (metadata) {
      console.log(`   Metadata:`, metadata);
    }
  }
}

/**
 * No-op Notification Adapter (for testing)
 */
export class NoOpNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    // Do nothing
  }
}

// Default adapter
export const notificationAdapter: INotificationAdapter = new ConsoleNotificationAdapter();
