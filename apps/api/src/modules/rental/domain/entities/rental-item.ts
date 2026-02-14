export interface RentalItemProps {
  readonly bikeId: string;
  readonly dailyRateCents: number;
}

export class RentalItem {
  private constructor(private readonly props: RentalItemProps) {}

  static create(bikeId: string, dailyRateCents: number): RentalItem {
    if (!bikeId || bikeId.trim().length === 0) {
      throw new Error('Bike ID cannot be empty');
    }
    if (dailyRateCents <= 0) {
      throw new Error('Daily rate must be positive');
    }
    return new RentalItem({ bikeId, dailyRateCents });
  }

  static reconstitute(props: RentalItemProps): RentalItem {
    return new RentalItem(props);
  }

  get bikeId(): string {
    return this.props.bikeId;
  }

  get dailyRateCents(): number {
    return this.props.dailyRateCents;
  }

  totalForDays(days: number): number {
    return this.props.dailyRateCents * days;
  }
}
