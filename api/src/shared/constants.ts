/* eslint-disable @typescript-eslint/naming-convention */
export const LOGGER = 'LOGGER';

export const ALLOWED_ROLES = 'Allowed Roles';

export const DB_TABLE_NAMES = {
  USERS: 'users',
  PROPERTY: 'properties',
  SUBSCRIPTION: 'subscription',
  CATEGORY: 'categories',
  TRANSACTION: 'transactions',
  AGENT: 'agent',
  SUBSCRIPTION_PLAN: 'subscriptionplans',
  SUBSCRIPTION_FEATURE: 'subscriptionfeatures',
  SUBSCRIPTION_TRANSACTION: 'subscriptiontransactions',
  SUBSCRIPTION_EVENT: 'subscriptionevents',
  SUBSCRIPTION_USAGE: 'subscriptionusages',
  NOTIFICATION: 'notifications',
  AUDIT_LOG: 'auditlogs',
  PLATFORM: 'platformrecords',
  REQUESTS: 'propertyrequests',
};

export const QUEUE_NAMES = {
  EMAIL: 'emailQueue',
  PAYMENT_WEBHOOK: 'paymentWebhookQueue',
  BILLING_REMINDER: 'billingReminderQueue',
  SUBSCRIPTION_RENEWAL: 'subscriptionRenewalQueue',
  GRACE_PERIOD_EXPIRY: 'gracePeriodExpiryQueue',
  USAGE_QUOTA_RESET: 'usageQuotaResetQueue',
};
