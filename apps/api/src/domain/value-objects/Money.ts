export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = "BRL") {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    if (!currency) {
      throw new Error("Currency is required");
    }

    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency.toUpperCase();
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error("Multiplier cannot be negative");
    }
    return new Money(this.amount * multiplier, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amount < other.amount;
  }

  private validateCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot operate with different currencies: ${this.currency} and ${other.currency}`
      );
    }
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
