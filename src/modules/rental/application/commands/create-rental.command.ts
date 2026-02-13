export interface RentalItemInput {
  readonly bikeId: string;
  readonly dailyRateCents: number;
}

export class CreateRentalCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: RentalItemInput[],
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {}
}
