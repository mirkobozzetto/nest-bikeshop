import { describe, it, expect } from 'vitest';
import { Customer } from './customer.entity.js';
import { Email } from '../value-objects/email.vo.js';
import { PhoneNumber } from '../value-objects/phone-number.vo.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('Customer Entity', () => {
  const params = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+33612345678',
    address: '123 Main St, Paris, France',
  };

  it('should register a new customer', () => {
    const customer = Customer.register(params);

    expect(customer.id).toBeDefined();
    expect(customer.firstName).toBe('John');
    expect(customer.lastName).toBe('Doe');
    expect(customer.email.value).toBe('john@example.com');
    expect(customer.phone.value).toBe('+33612345678');
    expect(customer.address).toBe('123 Main St, Paris, France');
    expect(customer.createdAt).toBeInstanceOf(Date);
    expect(customer.updatedAt).toBeInstanceOf(Date);
  });

  it('should reject registration with invalid first name', () => {
    expect(() => Customer.register({ ...params, firstName: '' })).toThrow(
      DomainException,
    );
  });

  it('should reject registration with invalid last name', () => {
    expect(() => Customer.register({ ...params, lastName: '' })).toThrow(
      DomainException,
    );
  });

  it('should reject registration with invalid email', () => {
    expect(() => Customer.register({ ...params, email: 'invalid' })).toThrow(
      DomainException,
    );
  });

  it('should reject registration with invalid phone', () => {
    expect(() => Customer.register({ ...params, phone: 'invalid' })).toThrow(
      DomainException,
    );
  });

  it('should reject registration with empty address', () => {
    expect(() => Customer.register({ ...params, address: '' })).toThrow(
      DomainException,
    );
  });

  it('should reconstitute customer from database', () => {
    const now = new Date();
    const email = Email.create('jane@example.com');
    const phone = PhoneNumber.create('0612345678');

    const customer = Customer.reconstitute({
      id: 'cust-123',
      firstName: 'Jane',
      lastName: 'Smith',
      email,
      phone,
      address: '456 Oak St',
      createdAt: now,
      updatedAt: now,
    });

    expect(customer.id).toBe('cust-123');
    expect(customer.firstName).toBe('Jane');
    expect(customer.email.equals(email)).toBe(true);
  });
});
