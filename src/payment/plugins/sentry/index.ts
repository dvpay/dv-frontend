import { App, Plugin } from 'vue';
import * as Sentry from '@sentry/vue';
import router from '@/payment/router';

const SentryPlugin: Plugin = {
  install(app: App) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    });
  },
};

export default SentryPlugin;
