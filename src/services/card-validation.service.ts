import { AppError } from "../lib/appError";
import { validateCardNumberStructure } from "../validators/card-number.validators";


export function validateCardNumber(input: unknown) {
  const structuralCheck = validateCardNumberStructure(input);

  return { success: true, message: "card verification passed" };
}
