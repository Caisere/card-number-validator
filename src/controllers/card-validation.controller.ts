import { NextFunction, Request, Response } from "express";
import { validateCardNumber } from "../services/card-validation.service";

export function validateCardController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cardNumber = req.body;
    const result = validateCardNumber(cardNumber)

    res.status(200).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    next(error);
  }
}
