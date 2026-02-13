import { describe, it, expect, vi } from 'vitest';
import { DomainExceptionFilter } from '../domain-exception.filter.js';
import { DomainException } from '../../../modules/shared/domain/exceptions/domain.exception.js';
import { HttpStatus } from '@nestjs/common';

function createMockHost(mockJson: ReturnType<typeof vi.fn>) {
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: mockJson,
  };
  return {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => ({}),
    }),
    getArgs: () => [],
    getArgByIndex: () => ({}),
    switchToRpc: () => ({}) as any,
    switchToWs: () => ({}) as any,
    getType: () => 'http' as const,
    mockResponse,
  };
}

describe('DomainExceptionFilter', () => {
  const filter = new DomainExceptionFilter();

  it('should return 404 for NOT_FOUND codes', () => {
    const mockJson = vi.fn();
    const host = createMockHost(mockJson);

    filter.catch(
      new DomainException('Bike not found', 'BIKE_NOT_FOUND'),
      host as any,
    );

    expect(host.mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'BIKE_NOT_FOUND',
      message: 'Bike not found',
    });
  });

  it('should return 409 for CONFLICT codes', () => {
    const mockJson = vi.fn();
    const host = createMockHost(mockJson);

    filter.catch(
      new DomainException('Not available', 'BIKE_NOT_AVAILABLE'),
      host as any,
    );

    expect(host.mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return 422 for unknown domain codes', () => {
    const mockJson = vi.fn();
    const host = createMockHost(mockJson);

    filter.catch(
      new DomainException('Some error', 'UNKNOWN_CODE'),
      host as any,
    );

    expect(host.mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  });
});
