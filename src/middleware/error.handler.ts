import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    sucess: false,
    message: "Internal Server Errro",
  });
}
