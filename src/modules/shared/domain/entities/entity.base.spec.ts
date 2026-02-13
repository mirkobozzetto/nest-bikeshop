import { describe, it, expect } from 'vitest';
import { Entity } from './entity.base.js';
interface TestProps {
  id: string;
  name: string;
}

class TestEntity extends Entity<TestProps> {
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  doSomething(): void {
    this.addEvent({
      eventName: 'TestDone',
      occurredAt: new Date(),
      aggregateId: this.id,
    });
  }

  static create(props: TestProps): TestEntity {
    return new TestEntity(props);
  }
}

describe('Entity base', () => {
  it('should store and expose id', () => {
    const entity = TestEntity.create({ id: 'abc-123', name: 'Test' });
    expect(entity.id).toBe('abc-123');
  });

  it('should collect domain events', () => {
    const entity = TestEntity.create({ id: 'abc-123', name: 'Test' });
    entity.doSomething();
    entity.doSomething();
    const events = entity.releaseEvents();
    expect(events).toHaveLength(2);
    expect(events[0].eventName).toBe('TestDone');
  });

  it('should clear events after release', () => {
    const entity = TestEntity.create({ id: 'abc-123', name: 'Test' });
    entity.doSomething();
    entity.releaseEvents();
    expect(entity.releaseEvents()).toHaveLength(0);
  });
});
