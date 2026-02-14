export type RentalAction = 'start' | 'return' | 'cancel';

export class UpdateRentalStatusCommand {
  constructor(
    public readonly rentalId: string,
    public readonly action: RentalAction,
  ) {}
}
