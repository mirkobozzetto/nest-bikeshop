import { describe, it, expect } from 'vitest';
import { PhoneNumber } from './phone-number.vo.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('PhoneNumber Value Object', () => {
  it('should create a valid phone number with +33 prefix', () => {
    const phone = PhoneNumber.create('+33612345678');
    expect(phone.value).toBe('+33612345678');
  });

  it('should create a valid phone number with 0 prefix', () => {
    const phone = PhoneNumber.create('0612345678');
    expect(phone.value).toBe('0612345678');
  });

  it('should reject phone with invalid format', () => {
    expect(() => PhoneNumber.create('invalid')).toThrow(DomainException);
    expect(() => PhoneNumber.create('123')).toThrow(DomainException);
    expect(() => PhoneNumber.create('+1234')).toThrow(DomainException);
  });

  it('should reject empty phone number', () => {
    expect(() => PhoneNumber.create('')).toThrow(DomainException);
  });

  it('should reject phone with letters', () => {
    expect(() => PhoneNumber.create('+33ABC12345')).toThrow(DomainException);
  });

  it('should compare phone numbers for equality', () => {
    const phone1 = PhoneNumber.create('+33612345678');
    const phone2 = PhoneNumber.create('+33612345678');
    const phone3 = PhoneNumber.create('0612345678');

    expect(phone1.equals(phone2)).toBe(true);
    expect(phone1.equals(phone3)).toBe(false);
  });

  it('should reject whitespace in phone number', () => {
    expect(() => PhoneNumber.create('+33 612 345 678')).toThrow(
      DomainException,
    );
  });
});
