import { describe, it, expect } from 'vitest';
import { Money } from './money.vo.js';

describe('Money', () => {
  it('should create from cents', () => {
    const money = Money.fromCents(1500);
    expect(money.value).toBe(1500);
  });

  it('should reject non-integer cents', () => {
    expect(() => Money.fromCents(15.5)).toThrow(
      'Money must be an integer (cents)',
    );
  });

  it('should create zero money', () => {
    const money = Money.zero();
    expect(money.value).toBe(0);
    expect(money.isZero()).toBe(true);
  });

  it('should add two money values', () => {
    const a = Money.fromCents(1000);
    const b = Money.fromCents(500);
    expect(a.add(b).value).toBe(1500);
  });

  it('should subtract two money values', () => {
    const a = Money.fromCents(1000);
    const b = Money.fromCents(300);
    expect(a.subtract(b).value).toBe(700);
  });

  it('should multiply by a factor', () => {
    const money = Money.fromCents(1000);
    expect(money.multiply(3).value).toBe(3000);
  });

  it('should round when multiplying with decimals', () => {
    const money = Money.fromCents(333);
    expect(money.multiply(0.1).value).toBe(33);
  });

  it('should detect positive, negative and zero', () => {
    expect(Money.fromCents(100).isPositive()).toBe(true);
    expect(Money.fromCents(-100).isNegative()).toBe(true);
    expect(Money.fromCents(0).isZero()).toBe(true);
  });

  it('should compare equality', () => {
    const a = Money.fromCents(500);
    const b = Money.fromCents(500);
    const c = Money.fromCents(300);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('should compare greaterThan', () => {
    const a = Money.fromCents(500);
    const b = Money.fromCents(300);
    expect(a.greaterThan(b)).toBe(true);
    expect(b.greaterThan(a)).toBe(false);
  });

  it('should format in EUR', () => {
    const money = Money.fromCents(1599);
    const formatted = money.format('fr-FR', 'EUR');
    expect(formatted).toContain('15,99');
  });
});
