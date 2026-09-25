export interface InitializeTransactionParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface VerifyTransactionResult {
  reference: string;
  gatewayReference: string;
  status: 'success' | 'failed' | 'abandoned' | 'pending';
  amountKobo: number;
  currency: string;
  paidAt?: Date;
  authorizationCode?: string;
  raw: Record<string, unknown>;
}

export interface ChargeAuthorizationParams {
  authorizationCode: string;
  email: string;
  amountKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface ChargeResult {
  reference: string;
  gatewayReference: string;
  status: 'success' | 'failed' | 'pending';
  amountKobo: number;
  authorizationCode?: string;
  raw: Record<string, unknown>;
}

export interface NormalizedWebhookEvent {
  event: string;
  reference?: string;
  gatewayEventId?: string;
  raw: Record<string, unknown>;
}

/**
 * Payment gateway adapter (DIP). All providers must implement this contract.
 * Browser redirects are UI-only — never activate subscriptions from client callbacks.
 */
export interface PaymentGatewayService {
  initializeTransaction(
    params: InitializeTransactionParams,
  ): Promise<InitializeTransactionResult>;

  verifyTransaction(reference: string): Promise<VerifyTransactionResult>;

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean;

  parseWebhookEvent?(rawBody: Buffer): NormalizedWebhookEvent;

  chargeAuthorization?(
    params: ChargeAuthorizationParams,
  ): Promise<ChargeResult>;
}
