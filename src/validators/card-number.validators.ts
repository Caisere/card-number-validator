import { env } from "../config/env";
import { AppError } from "../lib/appError";

type ValidateCardNumberStructureResponse = {
  success: boolean;
  digits: string;
};

// regex to replace any - in number string with empty string
function stripFormatting(input: string): string {
  return input.replace(/[\s-]/g, "");
}


export function validateCardNumberStructure(
  input: unknown,
): ValidateCardNumberStructureResponse {
  // verify if input is not undefined, null or empty string
  if (input === undefined || input === null || input === "") {
    throw new AppError(400, "card number can't be null, undefined or empty");
  }

  // confirm if input is a string type
  if (typeof input !== "string") {
    throw new AppError(400, "invalid_type");
  }

  // remove the dashes it present in put 
  const stripped = stripFormatting(input);
  
  if (stripped.length === 0 || !/^\d+$/.test(stripped)) {
    throw new AppError(400, "invalid_format");
  }

  // confirm the min and max length on the input after stripping, card number always be between 13-19
  if (
    stripped.length < env.cardMinLength ||
    stripped.length > env.cardMaxLength
  ) {
    throw new AppError(400, "invalid card-number length");
  }

  return { success: true, digits: stripped };
}
