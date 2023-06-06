import { NextFunction, Request, Response } from "express";
import { createErrorFactory } from "../../../../errors/factoryErrors";

type ErrorHandling = {
  [key: string]: (res: Response, message: string) => void;
};

enum ERRORS_NAMES {
  NoResultsFound = "NoResultsFound",
  internalServerError = "Internal server error",
}

export const NoResultsFound = createErrorFactory(ERRORS_NAMES.NoResultsFound);

const ERRORS_HANDLING: ErrorHandling = {
  NoResultsFound: (res: Response, message: string) => {
    res.status(400).json({ ok: false, message });
  },
  defaultError: (res: Response, message: string) => {
    res.status(500).json({ ok: false, message });
  },
};

export const errorCryptosHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (ERRORS_HANDLING[err.name]) {
    ERRORS_HANDLING[err.name](res, err.message);
  } else {
    ERRORS_HANDLING.defaultError(res, ERRORS_NAMES.internalServerError);
    next(err);
  }
};
