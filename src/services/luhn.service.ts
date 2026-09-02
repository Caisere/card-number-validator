export function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let doubleNumber = false;

  // Walk the digits from right to left.
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (doubleNumber) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleNumber = !doubleNumber;
  }

  return sum % 10 === 0;
}
