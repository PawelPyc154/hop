import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
// import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { PlaceRoute } from './routes/places.route';
// import { VisitRoute } from './routes/visits.route';

ValidateEnv();

const app = new App([new AuthRoute(), new PlaceRoute()]);

app.listen();
