import { Customer } from '../../../domain/entities/customer.entity.js';
import { Email } from '../../../domain/value-objects/email.vo.js';
import { PhoneNumber } from '../../../domain/value-objects/phone-number.vo.js';

interface PrismaCustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerMapper {
  static toDomain(raw: PrismaCustomerRow): Customer {
    return Customer.reconstitute({
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: Email.create(raw.email),
      phone: PhoneNumber.create(raw.phone),
      address: raw.address,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(customer: Customer) {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email.value,
      phone: customer.phone.value,
      address: customer.address,
      updatedAt: customer.updatedAt,
    };
  }
}
