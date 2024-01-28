/* eslint-disable @typescript-eslint/ban-ts-comment */
import { lucia } from "lucia";
import { mongoose as mongooseAdapter } from "@lucia-auth/adapter-mongoose";
import { express } from "lucia/middleware";
import { KeyModel } from "../models/key.model";
import { UserModel } from "../models/user.model";
import { SessionModel } from "../models/session.model";
import "lucia/polyfill/node";
import { DOMAIN } from "../config";

export const auth = lucia({
  adapter: mongooseAdapter({
    // @ts-expect-error
    User: UserModel,
    // @ts-expect-error
    Key: KeyModel,
    // @ts-expect-error
    Session: SessionModel,
  }),
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: { sameSite: "lax", domain: DOMAIN, path: "/" },
  },
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: express(),
  csrfProtection: false,

  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
