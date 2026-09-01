import { AppError } from "./appError";

// regex to replace any - in number string with empty string
export function stripFormatting(input: string): string {
  return input.replace(/[\s-]/g, "");
}

// regex function to confirm card-number digit validity
export function validateDigitsOnly(input: string): void {
  if (!/^\d+$/.test(input)) {
    throw new AppError(400, "Card number must contain digits only");
  }
}
