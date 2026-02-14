export class ExtendRentalCommand {
  constructor(
    public readonly rentalId: string,
    public readonly newEndDate: Date,
  ) {}
}
