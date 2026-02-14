import { describe, it, expect } from 'vitest';
import { DomainException } from './domain.exception.js';

describe('DomainException', () => {
  it('should create with message and code', () => {
    const error = new DomainException(
      'Bike not available',
      'BIKE_NOT_AVAILABLE',
    );
    expect(error.message).toBe('Bike not available');
    expect(error.code).toBe('BIKE_NOT_AVAILABLE');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const error = new DomainException('test', 'TEST');
    expect(error.name).toBe('DomainException');
  });
});
