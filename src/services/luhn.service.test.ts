import { isValidLuhn } from "./luhn.service";

describe("isValidHuhn", () => {
  it("returns true for a known valid card number", () => {
    expect(isValidLuhn("4111111111111111")).toBe(true);
  });

  it("returns true for another known valid card number", () => {
    expect(isValidLuhn("4539148803436467")).toBe(true);
  });

  it("returns false for a sequential, and non-checksum-valid number", () => {
    expect(isValidLuhn("1234567890123456")).toBe(false);
  });

  it("returns false when a single digit is altered on an otherwise valid number", () => {
    expect(isValidLuhn("4111111111111112")).toBe(false);
  });

  it("handles a short numeric string correctly (checksum math, not length policy)", () => {
    expect(isValidLuhn("0")).toBe(true);
  });
});
