export interface SaleItemInput {
  readonly bikeId: string;
  readonly priceCents: number;
}

export class CreateSaleCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: SaleItemInput[],
  ) {}
}
