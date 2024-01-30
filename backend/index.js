import express$1, { Router } from "express";
import { lucia } from "lucia";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { express } from "lucia/middleware";
import mongoose$1, { Schema, model, set, connect } from "mongoose";
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
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  validateOrReject,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import { z } from "zod";
const KeySchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    hashed_password: String,
  },
  { _id: false }
);
const KeyModel = model("Key", KeySchema);
const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
const UserModel = model("User", UserSchema);
const SessionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    active_expires: {
      type: Number,
      required: true,
    },
    idle_expires: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
const SessionModel = model("Session", SessionSchema);
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
process.env.CREDENTIALS === "true";
const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN, DOMAIN, ELO, DATABASE } =
  process.env;
const auth = lucia({
  adapter: mongoose({
    // @ts-expect-error
    User: UserModel,
    // @ts-expect-error
    Key: KeyModel,
    // @ts-expect-error
    Session: SessionModel,
  }),
  ...(process.env.NODE_ENV !== "development" && {
    sessionCookie: {
      name: "auth_session",
      expires: false,
      attributes: {
        sameSite: "none",
        domain: DOMAIN,
        path: "/",
      },
    },
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
    options: {},
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
    this.app.use(cors({ origin: true, credentials: true }));
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
          description: "Example docs",
        },
      },
      apis: ["swagger.yaml"],
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
    this.signUp = async (req, res, next) => {
      try {
        const { username, password } = req.body;
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
          userId: new mongoose$1.Types.ObjectId().toString(),
          key: {
            providerId: "username",
            // auth method
            providerUserId: username.toLowerCase(),
            // unique id when using "username" auth method
            password,
            // hashed by Lucia
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
        return res.status(200).json({ message: "success" });
      } catch (error) {
        next(error);
      }
    };
    this.signIn = async (req, res, next) => {
      try {
        const { username, password } = req.body;
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
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result =
    kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result =
        (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
class AuthUserDto {}
__decorateClass$1([IsString()], AuthUserDto.prototype, "username", 2);
__decorateClass$1(
  [IsString(), IsNotEmpty(), MinLength(9), MaxLength(32)],
  AuthUserDto.prototype,
  "password",
  2
);
class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
const ValidationMiddleware = (
  type,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false
) => {
  return (req, res, next) => {
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors) => {
        const message = errors
          .map((error) => Object.values(error.constraints))
          .join(", ");
        next(new HttpException(400, message));
      });
  };
};
class AuthRoute {
  constructor() {
    this.path = "/auth";
    this.router = Router();
    this.auth = new AuthController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      `${this.path}/sign-up`,
      ValidationMiddleware(AuthUserDto),
      this.auth.signUp
    );
    this.router.post(
      `${this.path}/sign-in`,
      ValidationMiddleware(AuthUserDto),
      this.auth.signIn
    );
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
  dentist: "dentist",
};
const placeCategories = Object.values(PlaceCategory);
const PlaceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: placeCategories,
    default: "barber",
  },
  image: {
    type: String,
    required: true,
  },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});
const PlaceModel = model("Place", PlaceSchema);
const ServiceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  place: { type: Schema.Types.ObjectId, ref: "Place" },
});
const ServiceModel = model("Service", ServiceSchema);
class PlaceController {
  constructor() {
    this.getPlaces = async (req, res, next) => {
      try {
        const category = req.query.category;
        const places = await PlaceModel.find({
          ...(category && { category }),
        }).populate({
          path: "services",
          model: ServiceModel,
        });
        await res.status(200).json({ items: places });
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
const VisitStatus = {
  pending: "pending",
  completed: "completed",
  canceled: "canceled",
  confirmed: "confirmed",
};
const visitStatuses = ["pending", "completed", "canceled", "confirmed"];
const VisitSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  visitDate: { type: Date, require: true },
  place: { type: Schema.Types.ObjectId, ref: "Place", require: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", require: true },
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  status: {
    type: String,
    enum: visitStatuses,
    default: VisitStatus.pending,
  },
});
const VisitModel = model("Visits", VisitSchema);
class VisitController {
  constructor() {
    this.getVisits = async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const myVisits = await VisitModel.find({ user: userId })
          .populate({
            path: "service",
            model: ServiceModel,
            select: "title",
          })
          .populate({
            path: "place",
            model: PlaceModel,
            select: "title",
          });
        const usersInfoSchema = z.array(
          z
            .object({
              _id: z.string(),
              visitDate: z.date(),
              service: z
                .object({ title: z.string() })
                .transform((item) => item.title),
              place: z
                .object({ title: z.string() })
                .transform((item) => item.title),
              status: z.enum(visitStatuses),
            })
            .transform(({ _id, ...item }) => ({
              id: _id,
              ...item,
            }))
        );
        const visits = await usersInfoSchema.parseAsync(myVisits);
        await res.status(200).json({
          items: visits,
        });
      } catch (error) {
        next(error);
      }
    };
    this.createVisit = async (req, res, next) => {
      try {
        const userId = req.user.userId;
        const { serviceId, placeId, visitDate } = req.body;
        await VisitModel.create({
          _id: new mongoose$1.Types.ObjectId(),
          visitDate,
          service: serviceId,
          place: placeId,
          user: userId,
        });
        await res.status(200).json({ success: true });
      } catch (error) {
        next(error);
      }
    };
  }
}
const AuthMiddleware = async (req, res, next) => {
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
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result =
    kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result =
        (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
class CreateVisitDto {}
__decorateClass([IsString()], CreateVisitDto.prototype, "serviceId", 2);
__decorateClass([IsString()], CreateVisitDto.prototype, "placeId", 2);
__decorateClass([IsString()], CreateVisitDto.prototype, "visitDate", 2);
class VisitRoute {
  constructor() {
    this.path = "/visits";
    this.router = Router();
    this.visit = new VisitController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.visit.getVisits);
    this.router.post(
      `${this.path}`,
      AuthMiddleware,
      ValidationMiddleware(CreateVisitDto),
      this.visit.createVisit
    );
  }
}
const app = new App([
  new UserRoute(),
  new VisitRoute(),
  new AuthRoute(),
  new PlaceRoute(),
]);
app.listen();
const viteNodeApp = app.app;
export { viteNodeApp };
