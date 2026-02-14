import { Entity } from '../../../shared/domain/entities/entity.base.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { DateRange } from '../../../shared/domain/value-objects/date-range.vo.js';
import type { RentalItem } from './rental-item.js';

export enum RentalStatus {
  RESERVED = 'RESERVED',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export interface RentalProps {
  readonly id: string;
  readonly customerId: string;
  readonly items: RentalItem[];
  period: DateRange;
  status: RentalStatus;
  totalCents: number;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface CreateRentalParams {
  readonly id: string;
  readonly customerId: string;
  readonly items: RentalItem[];
  readonly period: DateRange;
}

export class Rental extends Entity<RentalProps> {
  private constructor(props: RentalProps) {
    super(props);
  }

  static create(params: CreateRentalParams): Rental {
    if (!params.customerId || params.customerId.trim().length === 0) {
      throw new DomainException(
        'Customer ID cannot be empty',
        'RENTAL_CUSTOMER_EMPTY',
      );
    }
    if (!params.items || params.items.length === 0) {
      throw new DomainException(
        'Rental must have at least one item',
        'RENTAL_NO_ITEMS',
      );
    }

    const days = params.period.durationInDays();
    const totalCents = params.items.reduce(
      (sum, item) => sum + item.totalForDays(days),
      0,
    );

    const now = new Date();
    const rental = new Rental({
      ...params,
      status: RentalStatus.RESERVED,
      totalCents,
      createdAt: now,
      updatedAt: now,
    });

    rental.addEvent({
      eventName: 'RentalCreated',
      occurredAt: now,
      aggregateId: params.id,
    });

    return rental;
  }

  static reconstitute(props: RentalProps): Rental {
    return new Rental(props);
  }

  get id(): string {
    return this.props.id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): RentalItem[] {
    return this.props.items;
  }

  get period(): DateRange {
    return this.props.period;
  }

  get status(): RentalStatus {
    return this.props.status;
  }

  get totalCents(): number {
    return this.props.totalCents;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  start(): void {
    if (this.props.status !== RentalStatus.RESERVED) {
      throw new DomainException(
        `Cannot start rental in status ${this.props.status}`,
        'RENTAL_INVALID_TRANSITION',
      );
    }
    this.props.status = RentalStatus.ACTIVE;
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'RentalStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }

  return(): void {
    if (this.props.status !== RentalStatus.ACTIVE) {
      throw new DomainException(
        `Cannot return rental in status ${this.props.status}`,
        'RENTAL_INVALID_TRANSITION',
      );
    }
    this.props.status = RentalStatus.RETURNED;
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'RentalStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }

  cancel(): void {
    if (this.props.status !== RentalStatus.RESERVED) {
      throw new DomainException(
        `Cannot cancel rental in status ${this.props.status}`,
        'RENTAL_INVALID_TRANSITION',
      );
    }
    this.props.status = RentalStatus.CANCELLED;
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'RentalStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }

  extend(newEndDate: Date): void {
    if (this.props.status !== RentalStatus.ACTIVE) {
      throw new DomainException(
        `Cannot extend rental in status ${this.props.status}`,
        'RENTAL_INVALID_TRANSITION',
      );
    }
    if (newEndDate <= this.props.period.end) {
      throw new DomainException(
        'New end date must be after current end date',
        'RENTAL_EXTEND_INVALID_DATE',
      );
    }

    this.props.period = DateRange.create(this.props.period.start, newEndDate);
    const days = this.props.period.durationInDays();
    this.props.totalCents = this.props.items.reduce(
      (sum, item) => sum + item.totalForDays(days),
      0,
    );
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'RentalExtended',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }
}
