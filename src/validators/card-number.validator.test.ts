import { env } from "../config/env";
import { validateCardNumberStructure } from "./card-number.validator";

describe("validateCardNumberStructure", () => {
  it("accepts a clean digit-only string within the valid length range", () => {
    const result = validateCardNumberStructure("4111111111111111");
    expect(result).toEqual({ success: true, digits: "4111111111111111" });
  });

  it("strips spaces before validating", () => {
    const result = validateCardNumberStructure("4111 1111 1111 1111");
    expect(result).toEqual({ success: true, digits: "4111111111111111" });
  });

  it("strips dashes before validating", () => {
    const result = validateCardNumberStructure("4111-1111-1111-1111");
    expect(result).toEqual({ success: true, digits: "4111111111111111" });
  });

  it("rejects a missing value", () => {
    expect(() => validateCardNumberStructure(undefined)).toThrow(
      "card number can't be null, undefined or empty",
    );
  });

  it("rejects null", () => {
    expect(() => validateCardNumberStructure(null)).toThrow(
      "card number can't be null, undefined or empty",
    );
  });

  it("rejects an empty string", () => {
    expect(() => validateCardNumberStructure("")).toThrow(
      "card number can't be null, undefined or empty",
    );
  });

  it("rejects a non-string type, e.g. a number", () => {
    const value = 4111111111111111;

    expect(() => validateCardNumberStructure(value)).toThrow(
      `Card number must be a string`,
    );
  });

  it("rejects letters mixed into the digits", () => {
    const value = "4111abcd11111111";
    expect(() => validateCardNumberStructure(value)).toThrow(
      "Card number must contain digits only",
    );
  });

  it("rejects a number that is too short", () => {
    const value = "1234";
    expect(() => validateCardNumberStructure(value)).toThrow(
      `Card number must be between ${env.cardMinLength} and ${env.cardMaxLength} digits`,
    );
  });

  it("rejects a number that is too long", () => {
    const value = "12345678901234567890";
    expect(() => validateCardNumberStructure(value)).toThrow(
      `Card number must be between ${env.cardMinLength} and ${env.cardMaxLength} digits`,
    );
  });
});
