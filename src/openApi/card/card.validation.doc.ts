import { registry } from "../registry";
import { z } from "../../lib/zod";

registry.registerPath({
  method: "post",
  path: "/api/v1/validate-card",
  tags: ["Card"],
  operationId: "validateCard",
  summary: "Validate a transactional card number",
  description:
    "Validates the structure, length, and Luhn checksum of a card number.",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            cardNumber: z.string().openapi({ example: "4242-4242-4242-4242" }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Card verification passed successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "Card verification passed" }),
          }),
        },
      },
    },
    400: {
      description: "Malformed Payload / Input Validation Error",
      content: {
        "application/json": {
          schema: z.object({
            code: z
              .enum([
                "CARD_NUMBER_REQUIRED",
                "INVALID_DATA_TYPE",
                "INVALID_DIGIT_LENGTH",
              ])
              .openapi({ example: "INVALID_DIGIT_LENGTH" }),
            message: z.string().openapi({
              example: "Card number must be between 13 and 19 digits",
            }),
          }),
        },
      },
    },
    422: {
      description:
        "Syntactically correct but mathematically invalid card (Fails Luhn check)",
      content: {
        "application/json": {
          schema: z.object({
            code: z.string().openapi({ example: "CARD_LUHN_CHECK_FAILED" }),
            message: z
              .string()
              .openapi({ example: "card verification failed" }),
          }),
        },
      },
    },
  },
});
