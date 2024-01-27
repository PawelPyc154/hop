// const events = require("../routes/events");
// const auth = require("../routes/auth");
// const contact = require("../routes/contact");
import { Express } from "express";
import places from "./places";
import auth from "./auth";
import myVisits from "./my-visits";

export const routes = (app: Express) => {
  app.use("/api/auth", auth);
  app.use("/api/places", places);
  app.use("/api/my-visits", myVisits);
};
