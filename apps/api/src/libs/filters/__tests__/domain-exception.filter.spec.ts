import { describe, it, expect, vi } from 'vitest';
import { DomainExceptionFilter } from '../domain-exception.filter.js';
import { DomainException } from '../../../modules/shared/domain/exceptions/domain.exception.js';
import type { ArgumentsHost } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

function createMockHost(mockJson: ReturnType<typeof vi.fn>) {
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: mockJson,
  };
  const host = {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => ({}),
    }),
    getArgs: () => [],
    getArgByIndex: () => undefined,
    switchToRpc: () => {
      throw new Error('Not implemented');
    },
    switchToWs: () => {
      throw new Error('Not implemented');
    },
    getType: () => 'http' as const,
  } as unknown as ArgumentsHost;
  return { host, mockResponse };
}

describe('DomainExceptionFilter', () => {
  const filter = new DomainExceptionFilter();

  it('should return 404 for NOT_FOUND codes', () => {
    const mockJson = vi.fn();
    const { host, mockResponse } = createMockHost(mockJson);

    filter.catch(new DomainException('Bike not found', 'BIKE_NOT_FOUND'), host);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'BIKE_NOT_FOUND',
      message: 'Bike not found',
    });
  });

  it('should return 409 for CONFLICT codes', () => {
    const mockJson = vi.fn();
    const { host, mockResponse } = createMockHost(mockJson);

    filter.catch(
      new DomainException('Not available', 'BIKE_NOT_AVAILABLE'),
      host,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('should return 422 for unknown domain codes', () => {
    const mockJson = vi.fn();
    const { host, mockResponse } = createMockHost(mockJson);

    filter.catch(new DomainException('Some error', 'UNKNOWN_CODE'), host);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  });
});
