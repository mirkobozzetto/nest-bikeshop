export class UpdateSaleStatusCommand {
  constructor(
    public readonly saleId: string,
    public readonly action: 'confirm' | 'cancel',
  ) {}
}
