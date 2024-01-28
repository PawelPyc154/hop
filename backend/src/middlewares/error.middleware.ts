import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(error);
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    console.log(message);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
