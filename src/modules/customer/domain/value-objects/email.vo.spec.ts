import { describe, it, expect } from 'vitest';
import { Email } from './email.vo.js';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('john@example.com');
    expect(email.value).toBe('john@example.com');
  });

  it('should reject invalid email format', () => {
    expect(() => Email.create('invalid.email')).toThrow(DomainException);
    expect(() => Email.create('user@')).toThrow(DomainException);
    expect(() => Email.create('@example.com')).toThrow(DomainException);
    expect(() => Email.create('user@.com')).toThrow(DomainException);
  });

  it('should reject empty email', () => {
    expect(() => Email.create('')).toThrow(DomainException);
  });

  it('should normalize email to lowercase', () => {
    const email = Email.create('John@Example.COM');
    expect(email.value).toBe('john@example.com');
  });

  it('should compare emails for equality', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('test@example.com');
    const email3 = Email.create('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });

  it('should trim whitespace from email', () => {
    const email = Email.create('  test@example.com  ');
    expect(email.value).toBe('test@example.com');
  });
});
