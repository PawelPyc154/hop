import { UserRoute } from "./routes/users.route";
import { App } from "./app";
import { AuthRoute } from "./routes/auth.route";
import { PlaceRoute } from "./routes/places.route";
import { VisitRoute } from "./routes/visits.route";

const app = new App([
  new UserRoute(),
  new VisitRoute(),
  new AuthRoute(),
  new PlaceRoute(),
]);

app.listen();
export const viteNodeApp = app.app;
