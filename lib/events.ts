/**
 * Domain event system
 * Provides a simple event bus for loosely coupled components
 */

import { logger } from "./logger";

// Domain event types
export type DomainEventType =
  | "prompt.created"
  | "prompt.updated"
  | "prompt.deleted"
  | "prompt.viewed"
  | "prompt.used"
  | "collection.created"
  | "collection.updated"
  | "collection.deleted"
  | "favorite.added"
  | "favorite.removed"
  | "history.created";

export interface DomainEvent<T = any> {
  type: DomainEventType;
  timestamp: Date;
  data: T;
  metadata?: Record<string, any>;
}

export type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

class EventBus {
  private handlers: Map<DomainEventType, Set<EventHandler>> = new Map();

  /**
   * Register an event handler
   */
  on<T = any>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    logger.debug("Event handler registered", { eventType });

    // Return unsubscribe function
    return () => this.off(eventType, handler);
  }

  /**
   * Unregister an event handler
   */
  off<T = any>(eventType: DomainEventType, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      logger.debug("Event handler unregistered", { eventType });
    }
  }

  /**
   * Emit an event
   */
  async emit<T = any>(eventType: DomainEventType, data: T, metadata?: Record<string, any>): Promise<void> {
    const event: DomainEvent<T> = {
      type: eventType,
      timestamp: new Date(),
      data,
      metadata,
    };

    logger.info("Event emitted", { eventType, data: JSON.stringify(data) });

    const handlers = this.handlers.get(eventType);
    if (!handlers || handlers.size === 0) {
      logger.debug("No handlers for event", { eventType });
      return;
    }

    // Execute all handlers (could be parallel or sequential)
    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        logger.error("Event handler error", {
          eventType,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    await Promise.all(promises);
  }

  /**
   * Get number of handlers for an event type
   */
  getHandlerCount(eventType: DomainEventType): number {
    return this.handlers.get(eventType)?.size || 0;
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    logger.info("All event handlers cleared");
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Convenience functions for common events
export const events = {
  promptCreated: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("prompt.created", data, metadata),
  promptUpdated: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("prompt.updated", data, metadata),
  promptDeleted: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("prompt.deleted", data, metadata),
  promptViewed: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("prompt.viewed", data, metadata),
  promptUsed: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("prompt.used", data, metadata),
  collectionCreated: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("collection.created", data, metadata),
  collectionUpdated: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("collection.updated", data, metadata),
  collectionDeleted: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("collection.deleted", data, metadata),
  favoriteAdded: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("favorite.added", data, metadata),
  favoriteRemoved: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("favorite.removed", data, metadata),
  historyCreated: (data: any, metadata?: Record<string, any>) =>
    eventBus.emit("history.created", data, metadata),
};
