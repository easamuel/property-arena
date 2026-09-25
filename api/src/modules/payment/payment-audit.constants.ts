// Action names used for AUDIT_CATEGORY.PAYMENT entries. Kept as plain string
// constants (rather than a schema-level enum) since AuditLog.action is a
// free-form field shared across domains.
export enum PAYMENT_AUDIT_ACTION {
  CHECKOUT_INITIATED = 'checkout_initiated',
  CHECKOUT_FAILED = 'checkout_failed',
  WEBHOOK_RECEIVED = 'webhook_received',
  WEBHOOK_SIGNATURE_INVALID = 'webhook_signature_invalid',
  WEBHOOK_QUEUED = 'webhook_queued',
  WEBHOOK_PROCESSING_STARTED = 'webhook_processing_started',
  WEBHOOK_PROCESSING_FAILED = 'webhook_processing_failed',
  TRANSACTION_VERIFIED = 'transaction_verified',
  TRANSACTION_VERIFY_FAILED = 'transaction_verify_failed',
  SUBSCRIPTION_ACTIVATED = 'subscription_activated',
  PAYMENT_FAILED = 'payment_failed',
}
