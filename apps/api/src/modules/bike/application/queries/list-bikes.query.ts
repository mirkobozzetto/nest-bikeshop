import type {
  BikeStatus,
  BikeType,
} from '../../domain/entities/bike.entity.js';

export class ListBikesQuery {
  constructor(
    public readonly type?: BikeType,
    public readonly status?: BikeStatus,
    public readonly brand?: string,
  ) {}
}
