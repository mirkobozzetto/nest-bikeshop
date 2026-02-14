import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export class Email {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new DomainException('Email cannot be empty', 'EMAIL_EMPTY');
    }

    if (trimmed.includes(' ')) {
      throw new DomainException(
        'Email cannot contain whitespace',
        'EMAIL_WHITESPACE',
      );
    }

    const normalized = trimmed.toLowerCase();
    const email = new Email(normalized);

    if (!email.emailRegex.test(normalized)) {
      throw new DomainException('Invalid email format', 'EMAIL_INVALID_FORMAT');
    }

    return email;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
