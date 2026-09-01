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
} as const;
