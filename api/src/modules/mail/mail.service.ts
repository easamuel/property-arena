import { Inject, Injectable } from '@nestjs/common';
import { LOGGER } from '@shared/index';
import { Logger } from 'winston';

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

@Injectable()
export class MailService {
  private readonly logger: Logger;

  constructor(@Inject(LOGGER) logger: Logger) {
    this.logger = logger.child({ service: MailService.name });
  }

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY?.trim());
  }

  fromAddress() {
    return (
      process.env.RESEND_FROM_EMAIL?.trim() ||
      process.env.AUTH_SMTP_FROM?.trim() ||
      'PropertyArena <onboarding@resend.dev>'
    );
  }

  notifyAddress() {
    return (
      process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
      process.env.SEED_ADMIN_EMAIL?.trim() ||
      ''
    );
  }

  async send(input: SendEmailInput): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set — email skipped', {
        to: input.to,
        subject: input.subject,
      });
      return false;
    }

    const to = (Array.isArray(input.to) ? input.to : [input.to])
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (!to.length) return false;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromAddress(),
        to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      this.logger.warn('Resend send failed', {
        status: res.status,
        body: body.slice(0, 500),
        to,
        subject: input.subject,
      });
      return false;
    }

    this.logger.info('Email sent via Resend', { to, subject: input.subject });
    return true;
  }

  async sendAuthLink(
    kind: 'verify-email' | 'reset-password',
    email: string,
    link: string,
  ) {
    const isReset = kind === 'reset-password';
    const subject = isReset
      ? 'Reset your PropertyArena password'
      : 'Verify your PropertyArena email';
    const heading = isReset ? 'Reset your password' : 'Verify your email';
    const cta = isReset ? 'Reset password' : 'Verify email';
    const note = isReset
      ? 'If you did not request a password reset, you can ignore this email.'
      : 'Welcome to PropertyArena. Confirm your email to finish setting up your account.';

    return this.send({
      to: email,
      subject,
      text: `${heading}\n\n${link}\n\n${note}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;line-height:1.5;color:#111">
          <h1 style="font-size:20px;margin:0 0 12px">${heading}</h1>
          <p style="margin:0 0 16px">${note}</p>
          <p style="margin:0 0 24px">
            <a href="${link}" style="display:inline-block;background:#0f7a4a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">${cta}</a>
          </p>
          <p style="margin:0;font-size:12px;color:#666;word-break:break-all">${link}</p>
        </div>
      `,
    });
  }

  async sendNewsletterWelcome(email: string) {
    const site = (process.env.FRONTEND_URL || 'https://property.ajayidaniel.com.ng').replace(
      /\/+$/,
      '',
    );
    return this.send({
      to: email,
      subject: 'You’re on the PropertyArena deals list',
      text: `Thanks for subscribing. We’ll send new listings and offers to this inbox.\n\nBrowse: ${site}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;line-height:1.5;color:#111">
          <h1 style="font-size:20px;margin:0 0 12px">You’re subscribed</h1>
          <p style="margin:0 0 16px">Thanks for joining the PropertyArena list. We’ll share new listings, price drops and exclusive offers.</p>
          <p style="margin:0"><a href="${site}" style="color:#0f7a4a;font-weight:600">Browse properties</a></p>
        </div>
      `,
    });
  }

  async notifyNewLead(data: Record<string, unknown>) {
    const admin = this.notifyAddress();
    const name = String(data.name || 'Someone');
    const email = String(data.email || '');
    const phone = String(data.phone || '');
    const property = String(data.property || data.propertyTitle || 'a listing');
    const notes = String(data.notes || data.message || '');
    const propertyId = String(data.propertyId || '');

    const summary = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Property:</strong> ${escapeHtml(property)}${propertyId ? ` (${escapeHtml(propertyId)})` : ''}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(notes).replace(/\n/g, '<br/>')}</p>
    `;

    if (admin) {
      await this.send({
        to: admin,
        subject: `New listing enquiry — ${property}`,
        replyTo: email || undefined,
        html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">${summary}</div>`,
        text: `New enquiry from ${name} (${email}, ${phone}) for ${property}\n\n${notes}`,
      });
    }

    if (email) {
      await this.send({
        to: email,
        subject: 'We received your PropertyArena enquiry',
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;line-height:1.5">
            <h1 style="font-size:18px">Enquiry received</h1>
            <p>Thanks ${escapeHtml(name)}. We’ve shared your message about <strong>${escapeHtml(property)}</strong> with the listing team.</p>
            <p style="color:#666;font-size:13px">They typically reply within one business day.</p>
          </div>
        `,
        text: `Thanks ${name}. We received your enquiry about ${property}.`,
      });
    }
  }

  async notifyAdmin(subject: string, html: string, text?: string) {
    const admin = this.notifyAddress();
    if (!admin) return false;
    return this.send({ to: admin, subject, html, text });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
