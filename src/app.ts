import express from "express";
import { apiRouters } from "./routers";
import { errorHandler } from "./middleware/error.handler";
import { notFound } from "./middleware/not-found";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api", apiRouters);

  app.use(errorHandler);
  app.use(notFound);

  return app;
}
