import 'express-session';

declare module 'express-session' {
  interface SessionData {
    token: string;
    user: {
      email: string
      authenticated: boolean;
      site_origin: number;
    };
  }
}
