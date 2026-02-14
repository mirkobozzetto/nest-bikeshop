import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainException } from '../../modules/shared/domain/exceptions/domain.exception.js';

const CODE_TO_STATUS: Record<string, HttpStatus> = {
  BIKE_NOT_FOUND: HttpStatus.NOT_FOUND,
  CUSTOMER_NOT_FOUND: HttpStatus.NOT_FOUND,
  SALE_NOT_FOUND: HttpStatus.NOT_FOUND,
  RENTAL_NOT_FOUND: HttpStatus.NOT_FOUND,
  INVENTORY_MOVEMENT_NOT_FOUND: HttpStatus.NOT_FOUND,
  BIKE_NOT_AVAILABLE: HttpStatus.CONFLICT,
  BIKE_INVALID_TRANSITION: HttpStatus.CONFLICT,
  SALE_INVALID_TRANSITION: HttpStatus.CONFLICT,
  RENTAL_INVALID_TRANSITION: HttpStatus.CONFLICT,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      CODE_TO_STATUS[exception.code] ?? HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
    });
  }
}
