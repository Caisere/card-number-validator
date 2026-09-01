import dotenv from "dotenv";

dotenv.config();

function validateEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env variables for ${key}`);
  }

  return value;
}

export const env = {
  port: validateEnvVariable("PORT"),
  cardMinLength: Number(validateEnvVariable("MIN_CARD_LENGTH")),
  cardMaxLength: Number(validateEnvVariable("MAX_CARD_LENGTH")),
} as const;
