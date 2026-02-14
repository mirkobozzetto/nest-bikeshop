import { Entity } from '../../../shared/domain/entities/entity.base.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';
import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { v4 as uuidv4 } from 'uuid';

export interface CustomerProps {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: Email;
  phone: PhoneNumber;
  address: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

export interface RegisterCustomerParams {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
}

export class Customer extends Entity<CustomerProps> {
  private constructor(props: CustomerProps) {
    super(props);
  }

  static register(params: RegisterCustomerParams): Customer {
    if (!params.firstName || params.firstName.trim().length === 0) {
      throw new DomainException(
        'First name cannot be empty',
        'CUSTOMER_FIRST_NAME_EMPTY',
      );
    }

    if (!params.lastName || params.lastName.trim().length === 0) {
      throw new DomainException(
        'Last name cannot be empty',
        'CUSTOMER_LAST_NAME_EMPTY',
      );
    }

    if (!params.address || params.address.trim().length === 0) {
      throw new DomainException(
        'Address cannot be empty',
        'CUSTOMER_ADDRESS_EMPTY',
      );
    }

    const email = Email.create(params.email);
    const phone = PhoneNumber.create(params.phone);

    const now = new Date();
    const id = uuidv4();

    const customer = new Customer({
      id,
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      email,
      phone,
      address: params.address.trim(),
      createdAt: now,
      updatedAt: now,
    });

    customer.addEvent({
      eventName: 'CustomerRegistered',
      occurredAt: now,
      aggregateId: id,
    });

    return customer;
  }

  static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): Email {
    return this.props.email;
  }

  get phone(): PhoneNumber {
    return this.props.phone;
  }

  get address(): string {
    return this.props.address;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  update(params: {
    firstName?: string;
    lastName?: string;
    email?: Email;
    phone?: PhoneNumber;
    address?: string;
  }): void {
    if (params.firstName !== undefined) {
      if (!params.firstName || params.firstName.trim().length === 0) {
        throw new DomainException(
          'First name cannot be empty',
          'CUSTOMER_FIRST_NAME_EMPTY',
        );
      }
      this.props.firstName = params.firstName.trim();
    }
    if (params.lastName !== undefined) {
      if (!params.lastName || params.lastName.trim().length === 0) {
        throw new DomainException(
          'Last name cannot be empty',
          'CUSTOMER_LAST_NAME_EMPTY',
        );
      }
      this.props.lastName = params.lastName.trim();
    }
    if (params.email !== undefined) this.props.email = params.email;
    if (params.phone !== undefined) this.props.phone = params.phone;
    if (params.address !== undefined) {
      if (!params.address || params.address.trim().length === 0) {
        throw new DomainException(
          'Address cannot be empty',
          'CUSTOMER_ADDRESS_EMPTY',
        );
      }
      this.props.address = params.address.trim();
    }
    this.props.updatedAt = new Date();
  }
}
