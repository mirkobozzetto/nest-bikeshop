import type { Customer } from '../../domain/entities/customer.entity.js';

export class CustomerResponseDto {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromDomain(customer: Customer): CustomerResponseDto {
    return new CustomerResponseDto(
      customer.id,
      customer.firstName,
      customer.lastName,
      customer.email.value,
      customer.phone.value,
      customer.address,
      customer.createdAt,
      customer.updatedAt,
    );
  }
}
