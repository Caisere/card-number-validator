import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { env } from "../config/env";
import "../openApi/health.route.doc";
import "../openApi/card/card.validation.doc";

export function generateOpenApiDoc() {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Card-Number-Validation",
      version: "1.0.0",
      description: "A transactional card number validator",
    },
    servers: [
      { url: env.isProduction ? env.api_url : `http://localhost:${env.port}` },
    ],
  });
}
