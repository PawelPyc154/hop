import { NextFunction, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import { RequestWithUser } from "../interfaces/auth.interface";
import { auth } from "../utils/auth";

export const AuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authRequest = auth.handleRequest(req, res);

    const session = await authRequest.validate();
    if (session) {
      const user = session.user;
      const username = user.username;
      req.user = user;
      next();
    } else {
      next(new HttpException(401, "Wrong authentication token"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};
