export interface SaleItemProps {
  readonly bikeId: string;
  readonly priceCents: number;
}

export class SaleItem {
  private constructor(private readonly props: SaleItemProps) {}

  static create(bikeId: string, priceCents: number): SaleItem {
    if (!bikeId || bikeId.trim().length === 0) {
      throw new Error('Bike ID cannot be empty');
    }
    if (priceCents <= 0) {
      throw new Error('Price must be positive');
    }
    return new SaleItem({ bikeId, priceCents });
  }

  static reconstitute(props: SaleItemProps): SaleItem {
    return new SaleItem(props);
  }

  get bikeId(): string {
    return this.props.bikeId;
  }

  get priceCents(): number {
    return this.props.priceCents;
  }
}
