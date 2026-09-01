import { Router } from "express";
import { healthRoute } from "./health-check";
import cardNumberRouter from "./card-number.router";

export const apiRouters = Router();

apiRouters.use(healthRoute);
apiRouters.use("/validate-card", cardNumberRouter);
