import express$1, { Router } from "express";
import { lucia } from "lucia";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { express } from "lucia/middleware";
import { Schema, model, set, connect } from "mongoose";
import "lucia/polyfill/node";
import { config } from "dotenv";
import "reflect-metadata";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const KeySchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    hashed_password: String
  },
  { _id: false }
);
const KeyModel = model("Key", KeySchema);
const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  { _id: false }
);
const UserModel = model("User", UserSchema);
const SessionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    active_expires: {
      type: Number,
      required: true
    },
    idle_expires: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);
const SessionModel = model("Session", SessionSchema);
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
const CREDENTIALS = process.env.CREDENTIALS === "true";
const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DOMAIN,
  ELO,
  DATABASE
} = process.env;
const auth = lucia({
  adapter: mongoose({
    // @ts-expect-error
    User: UserModel,
    // @ts-expect-error
    Key: KeyModel,
    // @ts-expect-error
    Session: SessionModel
  }),
  sessionCookie: {
    name: "auth_session",
    expires: false,
    attributes: { sameSite: "lax", domain: DOMAIN, path: "/" }
  },
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: express(),
  csrfProtection: false,
  getUserAttributes: (data) => {
    return {
      username: data.username
    };
  }
});
class UserController {
  constructor() {
    this.getCurrentUser = async (req, res, next) => {
      try {
        const authRequest = auth.handleRequest(req, res);
        const session = await authRequest.validate();
        if (session) {
          const user = session.user;
          const username = user.username;
          return res.status(200).send({ username });
        }
        return res.status(400).send("Incorrect username or password");
      } catch (error) {
        next(error);
      }
    };
  }
}
class UserRoute {
  constructor() {
    this.path = "/users";
    this.router = Router();
    this.user = new UserController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(`${this.path}/me`, this.user.getCurrentUser);
  }
}
const dbConnection = async () => {
  const dbConfig = {
    url: DATABASE,
    options: {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }
  };
  if (NODE_ENV !== "production") {
    set("debug", true);
  }
  console.log(dbConfig.url);
  const conn = await connect(dbConfig.url, dbConfig.options);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
const ErrorMiddleware = (error, req, res, next) => {
  try {
    console.log(error);
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    console.log(message);
    res.status(status).json({ message });
  } catch (error2) {
    next(error2);
  }
};
class App {
  constructor(routes) {
    this.app = express$1();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3e3;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("");
    });
  }
  getServer() {
    return this.app;
  }
  async connectToDatabase() {
    await dbConnection();
  }
  async initializeMiddlewares() {
    this.app.use(express$1.urlencoded());
    this.app.use(morgan(LOG_FORMAT));
    console.log(typeof ORIGIN);
    this.app.use(cors({ origin: true, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express$1.json());
    this.app.use(express$1.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
  initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: "REST API",
          version: "1.0.0",
          description: "Example docs"
        }
      },
      apis: ["swagger.yaml"]
    };
    const specs = swaggerJSDoc(options);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }
  initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
class AuthController {
  constructor() {
    this.signIn = async (req, res, next) => {
      try {
        console.log("ELO", ELO);
        console.log("DOMAIN", DOMAIN);
        const { username, password } = req.body;
        if (typeof username !== "string" || username.length < 1 || username.length > 31) {
          await res.status(400).send("Invalid username");
        }
        if (typeof password !== "string" || password.length < 1 || password.length > 255) {
          await res.status(400).send("Invalid password");
        }
        const key = await auth.useKey(
          "username",
          username.toLowerCase(),
          password
        );
        const session = await auth.createSession({
          userId: key.userId,
          attributes: {}
        });
        const authRequest = auth.handleRequest(req, res);
        authRequest.setSession(session);
        return res.status(200).json({ message: "success" });
      } catch (error) {
        console.log(error);
        next(error);
      }
    };
    this.logOut = async (req, res, next) => {
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
}
class AuthRoute {
  constructor() {
    this.path = "/auth";
    this.router = Router();
    this.auth = new AuthController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(`${this.path}/sign-in`, this.auth.signIn);
    this.router.post(`${this.path}/logout`, this.auth.logOut);
  }
}
const PlaceCategory = {
  hairdresser: "hairdresser",
  barber: "barber",
  beauty: "beauty-studio",
  nails: "nails",
  massage: "massage",
  pets: "pets",
  physiotherapy: "physiotherapy",
  dentist: "dentist"
};
const placeCategories = Object.values(PlaceCategory);
const PlaceSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: placeCategories,
    default: "barber"
  },
  image: {
    type: String,
    required: true
  },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }]
});
const PlaceModel = model("Place", PlaceSchema);
class PlaceController {
  constructor() {
    this.getPlaces = async (req, res, next) => {
      try {
        const category = req.query.category;
        const places = await PlaceModel.find({
          ...category && { category }
        });
        await res.status(200).json({ items: places, message: "findAll" });
      } catch (error) {
        next(error);
      }
    };
  }
}
class PlaceRoute {
  constructor() {
    this.path = "/places";
    this.router = Router();
    this.place = new PlaceController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(`${this.path}`, this.place.getPlaces);
  }
}
const app = new App([new UserRoute(), new AuthRoute(), new PlaceRoute()]);
app.listen();
const viteNodeApp = app.app;
export {
  viteNodeApp
};
