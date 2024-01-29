import { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth";

export class UserController {
  public getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authRequest = auth.handleRequest(req, res);

      const session = await authRequest.validate();
      if (session) {
        const user = session.user;
        const username = user.username;
        return res.status(200).send({ username: username });
      }
      return res.status(400).send("Incorrect username or password");
    } catch (error) {
      next(error);
    }
  };
}
