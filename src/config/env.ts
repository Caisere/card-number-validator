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
  api_url: validateEnvVariable("API_URL"),
  node_env: validateEnvVariable("NODE_ENV"),
  isProduction: Boolean(validateEnvVariable("NODE_ENV") === "production"),
} as const;
