import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === "development",
  
  // Server-specific integrations
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],
  
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Network request failed",
  ],
  
  environment: process.env.NODE_ENV,
  release: process.env.npm_package_version,
});
