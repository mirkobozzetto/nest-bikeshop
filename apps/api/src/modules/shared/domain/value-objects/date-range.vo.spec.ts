import { describe, it, expect } from 'vitest';
import { DateRange } from './date-range.vo.js';

describe('DateRange', () => {
  const jan1 = new Date('2026-01-01');
  const jan5 = new Date('2026-01-05');
  const jan3 = new Date('2026-01-03');
  const jan7 = new Date('2026-01-07');
  const jan10 = new Date('2026-01-10');

  it('should create a valid date range', () => {
    const range = DateRange.create(jan1, jan5);
    expect(range.start.getTime()).toBe(jan1.getTime());
    expect(range.end.getTime()).toBe(jan5.getTime());
  });

  it('should reject end before start', () => {
    expect(() => DateRange.create(jan5, jan1)).toThrow(
      'End date must be after start date',
    );
  });

  it('should reject same start and end', () => {
    expect(() => DateRange.create(jan1, jan1)).toThrow(
      'End date must be after start date',
    );
  });

  it('should calculate duration in days', () => {
    const range = DateRange.create(jan1, jan5);
    expect(range.durationInDays()).toBe(4);
  });

  it('should detect overlapping ranges', () => {
    const a = DateRange.create(jan1, jan5);
    const b = DateRange.create(jan3, jan7);
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  it('should detect non-overlapping ranges', () => {
    const a = DateRange.create(jan1, jan3);
    const b = DateRange.create(jan5, jan10);
    expect(a.overlaps(b)).toBe(false);
  });

  it('should check if date is contained', () => {
    const range = DateRange.create(jan1, jan5);
    expect(range.contains(jan3)).toBe(true);
    expect(range.contains(jan7)).toBe(false);
  });

  it('should compare equality', () => {
    const a = DateRange.create(jan1, jan5);
    const b = DateRange.create(jan1, jan5);
    const c = DateRange.create(jan1, jan7);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('should return defensive copies of dates', () => {
    const range = DateRange.create(jan1, jan5);
    const start = range.start;
    start.setFullYear(2000);
    expect(range.start.getTime()).toBe(jan1.getTime());
  });
});
