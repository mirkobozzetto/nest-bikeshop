export type BikeAction = 'rent' | 'return' | 'sell' | 'maintenance' | 'retire';

export class UpdateBikeStatusCommand {
  constructor(
    public readonly bikeId: string,
    public readonly action: BikeAction,
  ) {}
}
