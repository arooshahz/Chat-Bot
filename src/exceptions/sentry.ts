import * as SentryProvider from '@sentry/node';

export class Sentry {
  constructor() {
    SentryProvider.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.APP_ENV || 'local',
    });
  }

  async captureException(exception, contexts) {
    SentryProvider.captureException(exception, {
      contexts: contexts,
    });
  }
}
