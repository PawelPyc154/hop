import { connectDB } from "database";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

connectDB();
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded());
app.use(express.json());

// app.use(cookieParser()); // Cookie parser
routes(app);

if (import.meta.env.PROD) app.listen(3000);

export const viteNodeApp = app;
