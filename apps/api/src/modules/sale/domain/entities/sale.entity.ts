import { Entity } from '../../../shared/domain/entities/entity.base.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import type { SaleItem } from './sale-item.js';

export enum SaleStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface SaleProps {
  readonly id: string;
  readonly customerId: string;
  readonly items: SaleItem[];
  status: SaleStatus;
  totalCents: number;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleParams {
  readonly id: string;
  readonly customerId: string;
  readonly items: SaleItem[];
}

export class Sale extends Entity<SaleProps> {
  private constructor(props: SaleProps) {
    super(props);
  }

  static create(params: CreateSaleParams): Sale {
    if (!params.customerId || params.customerId.trim().length === 0) {
      throw new DomainException(
        'Customer ID cannot be empty',
        'SALE_CUSTOMER_EMPTY',
      );
    }
    if (!params.items || params.items.length === 0) {
      throw new DomainException(
        'Sale must have at least one item',
        'SALE_NO_ITEMS',
      );
    }

    const totalCents = params.items.reduce(
      (sum, item) => sum + item.priceCents,
      0,
    );

    const now = new Date();
    const sale = new Sale({
      ...params,
      status: SaleStatus.PENDING,
      totalCents,
      createdAt: now,
      updatedAt: now,
    });

    sale.addEvent({
      eventName: 'SaleCreated',
      occurredAt: now,
      aggregateId: params.id,
    });

    return sale;
  }

  static reconstitute(props: SaleProps): Sale {
    return new Sale(props);
  }

  get id(): string {
    return this.props.id;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get items(): SaleItem[] {
    return this.props.items;
  }

  get status(): SaleStatus {
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

  calculateTVA(ratePercent: number): number {
    return Math.round(this.props.totalCents * (ratePercent / 100));
  }

  confirm(): void {
    if (this.props.status !== SaleStatus.PENDING) {
      throw new DomainException(
        `Cannot confirm sale in status ${this.props.status}`,
        'SALE_INVALID_TRANSITION',
      );
    }
    this.props.status = SaleStatus.CONFIRMED;
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'SaleStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }

  cancel(): void {
    if (this.props.status !== SaleStatus.PENDING) {
      throw new DomainException(
        `Cannot cancel sale in status ${this.props.status}`,
        'SALE_INVALID_TRANSITION',
      );
    }
    this.props.status = SaleStatus.CANCELLED;
    this.props.updatedAt = new Date();
    this.addEvent({
      eventName: 'SaleStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }
}
