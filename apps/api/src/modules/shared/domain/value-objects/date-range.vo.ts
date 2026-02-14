export class DateRange {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date,
  ) {}

  static create(start: Date, end: Date): DateRange {
    if (end <= start) {
      throw new Error('End date must be after start date');
    }
    return new DateRange(new Date(start.getTime()), new Date(end.getTime()));
  }

  get start(): Date {
    return new Date(this._start.getTime());
  }

  get end(): Date {
    return new Date(this._end.getTime());
  }

  durationInDays(): number {
    const diffMs = this._end.getTime() - this._start.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  overlaps(other: DateRange): boolean {
    return this._start < other._end && this._end > other._start;
  }

  contains(date: Date): boolean {
    return date >= this._start && date <= this._end;
  }

  equals(other: DateRange): boolean {
    return (
      this._start.getTime() === other._start.getTime() &&
      this._end.getTime() === other._end.getTime()
    );
  }
}
