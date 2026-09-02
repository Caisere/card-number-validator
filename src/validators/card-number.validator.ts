import { env } from "../config/env";
import { AppError } from "../lib/appError";
import { stripFormatting, validateDigitsOnly } from "../lib/helpers";

export type ValidateCardNumberStructureResponse = {
  success: boolean;
  digits: string;
};

export function validateCardNumberStructure(
  input: unknown,
): ValidateCardNumberStructureResponse {
  // verify if input is not undefined, null or empty string
  if (input === undefined || input === null || input === "") {
    throw new AppError(400, "card number can't be null, undefined or empty");
  }

  // confirm if input is a string type
  if (typeof input !== "string") {
    throw new AppError(400, "Card number must be a string");
  }

  // remove the dashes it present in put
  const strippedInput = stripFormatting(input);

  if (strippedInput.length === 0) {
    throw new AppError(400, "Card number must contain at least one digit");
  }

  // validate card number contains only number
  validateDigitsOnly(strippedInput);

  // confirm the min and max length on the input after stripping, card number always be between 13-19
  if (
    strippedInput.length < env.cardMinLength ||
    strippedInput.length > env.cardMaxLength
  ) {
    throw new AppError(
      400,
      `Card number must be between ${env.cardMinLength} and ${env.cardMaxLength} digits`,
    );
  }

  return { success: true, digits: strippedInput };
}
