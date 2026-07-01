import { EventEmitter } from "events";

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    // Set max listeners to prevent warnings in large event chains
    this.setMaxListeners(100);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
}

export const eventBus = EventBus.getInstance();
