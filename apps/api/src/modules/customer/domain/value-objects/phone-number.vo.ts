import { DomainException } from '../../../shared/domain/exceptions/domain.exception.js';

export class PhoneNumber {
  private readonly phoneRegex = /^(\+33|0)[1-9]\d{8}$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): PhoneNumber {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new DomainException('Phone number cannot be empty', 'PHONE_EMPTY');
    }

    if (trimmed.includes(' ')) {
      throw new DomainException(
        'Phone number cannot contain whitespace',
        'PHONE_WHITESPACE',
      );
    }

    const phone = new PhoneNumber(trimmed);

    if (!phone.phoneRegex.test(trimmed)) {
      throw new DomainException(
        'Invalid phone number format',
        'PHONE_INVALID_FORMAT',
      );
    }

    return phone;
  }

  get value(): string {
    return this._value;
  }

  equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }
}
