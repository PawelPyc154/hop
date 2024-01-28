import { lucia } from 'lucia';
import { mongoose as mongooseAdapter } from '@lucia-auth/adapter-mongoose';
import { express } from 'lucia/middleware';
import { KeyModel } from '@/models/key.model';
import { UserModel } from '@/models/user.model';
import { SessionModel } from '@/models/session.model';

export const auth = lucia({
  adapter: mongooseAdapter({
    User: UserModel,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Key: KeyModel,
    Session: SessionModel,
  }),
  env: 'DEV',
  middleware: express(),
  csrfProtection: false,

  getUserAttributes: data => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
