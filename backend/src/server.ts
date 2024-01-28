import { UserRoute } from './routes/users.route';
import { App } from './app';
import { AuthRoute } from './routes/auth.route';
import { PlaceRoute } from './routes/places.route';

const app = new App([new UserRoute(), new AuthRoute(), new PlaceRoute()]);

app.listen();
export const viteNodeApp = app.app;
