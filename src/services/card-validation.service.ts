import { AppError } from "../lib/appError";
import { validateCardNumberStructure } from "../validators/card-number.validators";
import { isValidLuhm } from "./luhm.service";

export function validateCardNumber(input: unknown) {
  const structuralCheck = validateCardNumberStructure(input);

  const passesLuhn = isValidLuhm(structuralCheck.digits);

  if (!passesLuhn) {
    throw new AppError(200, "card verification failed");
  }

  return { success: true, message: "card verification passed" };
}
