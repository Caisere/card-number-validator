import { Router } from "express";
import { validateCardController } from "../controllers/card-validation.controller";

const cardNumberRouter = Router();

cardNumberRouter.post("/", validateCardController);

export default cardNumberRouter
