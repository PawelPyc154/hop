import { connect, set } from "mongoose";
import { NODE_ENV, DATABASE } from "../config";

export const dbConnection = async () => {
  const dbConfig = {
    url: DATABASE,
    options: {},
  };

  if (NODE_ENV !== "production") {
    set("debug", true);
  }
  console.log(dbConfig.url);

  const conn = await connect(dbConfig.url, dbConfig.options);

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
