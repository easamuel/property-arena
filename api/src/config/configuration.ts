/* eslint-disable no-constant-binary-expression */
export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 2001,
  app: {
    name: process.env.APP_NAME,
    slug: process.env.APP_SLUG,
    frontendUrl: process.env.FRONTEND_URL,
  },
  database: {
    url: process.env.DATABASE_URL,
    enableTransactions: process.env.ENABLE_MONGODB_TRANSACTIONS === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
  },
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || process.env.SEED_ADMIN_EMAIL,
  grafana: {
    lokiHost: process.env.GRAFANA_LOKI_HOST,
  },
  throttle: {
    ttl: Number(process.env.THROTTLE_TTL) ?? 60000,
    limit: Number(process.env.THROTTLE_LIMIT) ?? 10,
  },
  cache: {
    ttl: Number(process.env.CACHE_TTL) ?? 30000,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0", 10),
    tls: process.env.REDIS_TLS === "true",
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    baseUrl: process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET,
  },
  flutterwave: {
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    secretHash: process.env.FLUTTERWAVE_SECRET_HASH,
    baseUrl: process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3',
  },
  subscription: {
    trialDays: Number(process.env.SUBSCRIPTION_TRIAL_DAYS) || 30,
  },
  isTest(): boolean {
    return process.env.NODE_ENV === "test";
  },
  isDev(): boolean {
    const env = process.env.NODE_ENV;
    const envs = ["development", "localhost", "local", "dev"];
    return !env || envs.includes(env);
  },
  isStaging(): boolean {
    return process.env.NODE_ENV === "staging";
  },
  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
});
