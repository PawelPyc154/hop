import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { auth } from "../utils/auth";
import mongoose from "mongoose";

export class AuthController {
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      // basic check
      if (
        typeof username !== "string" ||
        username.length < 4 ||
        username.length > 31
      ) {
        return res.status(400).send("Invalid username");
      }
      if (
        typeof password !== "string" ||
        password.length < 6 ||
        password.length > 255
      ) {
        return res.status(400).send("Invalid password");
      }

      const user = await auth.createUser({
        userId: new mongoose.Types.ObjectId().toString(),

        key: {
          providerId: "username", // auth method
          providerUserId: username.toLowerCase(), // unique id when using "username" auth method
          password, // hashed by Lucia
        },
        attributes: {
          username,
        },
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);

      // redirect to profile page
      return res.status(200).json({ message: "success" });

      //  todo
      // if (e instanceof Error && e.message === "AUTH_DUPLICATE_KEY_ID") {
      //   return res.status(400).send("Username already taken");
      // }

      // return res.status(500).send("An unknown error occurred");
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      // basic check
      if (
        typeof username !== "string" ||
        username.length < 1 ||
        username.length > 31
      ) {
        await res.status(400).send("Invalid username");
      }
      if (
        typeof password !== "string" ||
        password.length < 1 ||
        password.length > 255
      ) {
        await res.status(400).send("Invalid password");
      }
      // find user by key
      // and validate password
      const key = await auth.useKey(
        "username",
        username.toLowerCase(),
        password
      );

      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);
      // redirect to profile page
      return res.status(200).json({ message: "success" });
      // todo
      // // check for unique constraint error in user table
      // if (
      //   e instanceof LuciaError &&
      //   (e.message === "AUTH_INVALID_KEY_ID" ||
      //     e.message === "AUTH_INVALID_PASSWORD")
      // ) {
      //   // user does not exist
      //   // or invalid password
      //   return res.status(400).send("Incorrect username or password");
      // }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authRequest = auth.handleRequest(req, res);
      const session = await authRequest.validate();
      if (!session) {
        return res.sendStatus(401);
      }
      await auth.invalidateSession(session.sessionId);

      authRequest.setSession(null);

      return res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  };
}
