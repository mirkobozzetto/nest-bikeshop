import type { DomainEvent } from '../events/domain-event.js';

export abstract class Entity<T> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(protected readonly props: T) {}

  abstract get id(): string;

  protected addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  releaseEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
