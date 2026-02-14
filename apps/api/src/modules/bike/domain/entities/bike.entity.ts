import { Entity } from '../../../shared/domain/entities/entity.base.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
export enum BikeType {
  ROAD = 'ROAD',
  MOUNTAIN = 'MOUNTAIN',
  CITY = 'CITY',
  ELECTRIC = 'ELECTRIC',
  KIDS = 'KIDS',
}

export enum BikeStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  SOLD = 'SOLD',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export interface BikeProps {
  readonly id: string;
  name: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  priceCents: number;
  dailyRateCents: number;
  status: BikeStatus;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface CreateBikeParams {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly model: string;
  readonly type: BikeType;
  readonly size: string;
  readonly priceCents: number;
  readonly dailyRateCents: number;
}

const ALLOWED_TRANSITIONS: Record<BikeStatus, BikeStatus[]> = {
  [BikeStatus.AVAILABLE]: [
    BikeStatus.RENTED,
    BikeStatus.SOLD,
    BikeStatus.MAINTENANCE,
    BikeStatus.RETIRED,
  ],
  [BikeStatus.RENTED]: [BikeStatus.AVAILABLE, BikeStatus.MAINTENANCE],
  [BikeStatus.SOLD]: [],
  [BikeStatus.MAINTENANCE]: [BikeStatus.AVAILABLE, BikeStatus.RETIRED],
  [BikeStatus.RETIRED]: [],
};

export class Bike extends Entity<BikeProps> {
  private constructor(props: BikeProps) {
    super(props);
  }

  static create(params: CreateBikeParams): Bike {
    if (!params.name || params.name.trim().length === 0) {
      throw new DomainException('Bike name cannot be empty', 'BIKE_NAME_EMPTY');
    }
    if (params.priceCents <= 0) {
      throw new DomainException(
        'Bike price must be positive',
        'BIKE_PRICE_INVALID',
      );
    }
    if (params.dailyRateCents <= 0) {
      throw new DomainException(
        'Daily rate must be positive',
        'BIKE_DAILY_RATE_INVALID',
      );
    }

    const now = new Date();
    const bike = new Bike({
      ...params,
      status: BikeStatus.AVAILABLE,
      createdAt: now,
      updatedAt: now,
    });

    bike.addEvent({
      eventName: 'BikeCreated',
      occurredAt: now,
      aggregateId: params.id,
    });

    return bike;
  }

  static reconstitute(props: BikeProps): Bike {
    return new Bike(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get brand(): string {
    return this.props.brand;
  }

  get model(): string {
    return this.props.model;
  }

  get type(): BikeType {
    return this.props.type;
  }

  get size(): string {
    return this.props.size;
  }

  get priceCents(): number {
    return this.props.priceCents;
  }

  get dailyRateCents(): number {
    return this.props.dailyRateCents;
  }

  get status(): BikeStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(params: Partial<Omit<CreateBikeParams, 'id'>>): void {
    if (params.name !== undefined) {
      if (!params.name || params.name.trim().length === 0) {
        throw new DomainException(
          'Bike name cannot be empty',
          'BIKE_NAME_EMPTY',
        );
      }
      this.props.name = params.name.trim();
    }
    if (params.priceCents !== undefined) {
      if (params.priceCents <= 0) {
        throw new DomainException(
          'Bike price must be positive',
          'BIKE_PRICE_INVALID',
        );
      }
      this.props.priceCents = params.priceCents;
    }
    if (params.dailyRateCents !== undefined) {
      if (params.dailyRateCents <= 0) {
        throw new DomainException(
          'Daily rate must be positive',
          'BIKE_DAILY_RATE_INVALID',
        );
      }
      this.props.dailyRateCents = params.dailyRateCents;
    }
    if (params.brand !== undefined) this.props.brand = params.brand;
    if (params.model !== undefined) this.props.model = params.model;
    if (params.type !== undefined) this.props.type = params.type;
    if (params.size !== undefined) this.props.size = params.size;
    this.props.updatedAt = new Date();
  }

  markAsRented(): void {
    this.transitionTo(BikeStatus.RENTED);
  }

  markAsReturned(): void {
    if (
      this.props.status !== BikeStatus.RENTED &&
      this.props.status !== BikeStatus.MAINTENANCE
    ) {
      throw new DomainException(
        `Cannot return bike in status ${this.props.status}`,
        'BIKE_INVALID_TRANSITION',
      );
    }
    this.transitionTo(BikeStatus.AVAILABLE);
  }

  markAsSold(): void {
    this.transitionTo(BikeStatus.SOLD);
  }

  sendToMaintenance(): void {
    this.transitionTo(BikeStatus.MAINTENANCE);
  }

  retire(): void {
    this.transitionTo(BikeStatus.RETIRED);
  }

  private transitionTo(newStatus: BikeStatus): void {
    const allowed = ALLOWED_TRANSITIONS[this.props.status];
    if (!allowed.includes(newStatus)) {
      throw new DomainException(
        `Cannot transition from ${this.props.status} to ${newStatus}`,
        'BIKE_INVALID_TRANSITION',
      );
    }

    this.props.status = newStatus;
    this.props.updatedAt = new Date();

    this.addEvent({
      eventName: 'BikeStatusChanged',
      occurredAt: new Date(),
      aggregateId: this.props.id,
    });
  }
}
