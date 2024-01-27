import { lucia } from "lucia";
import { mongoose as mongooseAdapter } from "@lucia-auth/adapter-mongoose";
import { User, Session, Key } from "database";
import { express } from "lucia/middleware";
import mongoose from "mongoose";

export const auth = lucia({
  adapter: mongooseAdapter({
    User,
    // @ts-expect-error
    Key,
    Session,
  }),
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
