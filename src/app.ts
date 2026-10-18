import express from "express";
import { apiRouters } from "./routers";
import { errorHandler } from "./middleware/error.handler";
import { notFound } from "./middleware/not-found";
import { generateOpenApiDoc } from "./openApi/generate";
import { apiReference } from "@scalar/express-api-reference";

export function createApp() {
  const app = express();

  app.use(express.json());

  const doc = generateOpenApiDoc();
  app.get("/openapi.json", (_req, res) => res.json(doc));
  app.use("/docs", apiReference({ url: "/openapi.json" }));

  app.use("/api/v1", apiRouters);

  app.use(errorHandler);
  app.use(notFound);

  return app;
}
