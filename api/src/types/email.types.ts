export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailPayload {
  to: EmailRecipient[];
  from?: EmailRecipient;
  subject: string;
  templateId: string;
  templateData: Record<string, any>;
}

export enum EmailTemplateID {
  OTP = "otp.njk",
  WELCOME = "welcome.njk",
}
