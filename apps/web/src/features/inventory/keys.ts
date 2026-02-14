export const inventoryKeys = {
  all: ['inventory'] as const,
  stock: (bikeId: string) => [...inventoryKeys.all, 'stock', bikeId] as const,
  movements: (bikeId: string) =>
    [...inventoryKeys.all, 'movements', bikeId] as const,
};
