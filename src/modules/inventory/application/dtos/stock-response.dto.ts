export class StockResponseDto {
  constructor(
    public readonly bikeId: string,
    public readonly quantity: number,
  ) {}
}
