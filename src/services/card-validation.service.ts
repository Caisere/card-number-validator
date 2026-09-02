import { AppError } from "../lib/appError";
import { validateCardNumberStructure } from "../validators/card-number.validator";
import { isValidLuhn } from "./luhn.service";

export function validateCardNumber(input: unknown) {
  const structuralCheck = validateCardNumberStructure(input);

  const passesLuhn = isValidLuhn(structuralCheck.digits);

  if (!passesLuhn) {
    throw new AppError(200, "card verification failed");
  }

  return { success: true, message: "card verification passed" };
}
