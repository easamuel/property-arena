import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CustomHttpException } from 'src/shared/exception.handler';
import { LOGGER } from 'src/shared';
import { Logger } from 'winston';
import moment from 'moment';
import { pick, omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import {
  ForgotPasswordDto,
  LoginDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { ROLE_ENUM, User } from '@modules/user/schemas/user.schema';
import { AgentService } from '@modules/agent/agent.service';
import { MailService } from '@modules/mail/mail.service';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

interface UserCreationResult {
  user: User;
  [key: string]: any;
}

interface UserCreationStrategy {
  create(payload: any): Promise<UserCreationResult>;
}
@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly agentService: AgentService,
    private readonly mailService: MailService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: AuthService.name });
  }

  private AgentCreationStrategy: UserCreationStrategy = {
    create: async (payload: any) => {
      return await this.userService.userDAL.transaction(async (transaction) => {
        const user = (await this.userService.userDAL.create(
          payload,
          transaction,
        )) as User;

        const agent = await this.agentService.createAgent(
          {
            ...payload,
            user: user.id,
          },
          transaction,
        );

        return { user, agent };
      });
    },
  };

  private DefaultUserCreationStrategy: UserCreationStrategy = {
    create: async (payload: any) => {
      const user = await this.userService.createOne(payload);
      return { user }; // <- wrap in an object
    },
  };

  // Strategy selector
  private getStrategy(role: string): UserCreationStrategy {
    switch (role.toLowerCase()) {
      case ROLE_ENUM.AGENT:
      case ROLE_ENUM.AGENCY:
        return this.AgentCreationStrategy;
      default:
        return this.DefaultUserCreationStrategy;
    }
  }

  async register(payload: any) {
    const email = payload.email.trim().toLowerCase();
    const existingUser = await this.userService.findOne({ email });

    if (existingUser) {
      this.logger.info('Failed signup attempt', {
        payload: { ...payload, password: '' },
      });

      throw new CustomHttpException(
        'email already in use',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hash(payload.password, 8);
    const role = payload.role?.toLowerCase() || 'default';

    const strategy = this.getStrategy(role);

    const { user: createdUser, agent } = await strategy.create({
      ...payload,
      email,
      password: hashedPassword,
    });

    const { token, tokenHash, expires } = this.generateToken(
      EMAIL_VERIFICATION_TTL_MS,
    );
    const user =
      (await this.userService.userDAL.updateOne(
        { _id: createdUser.id ?? createdUser._id },
        {
          emailVerificationTokenHash: tokenHash,
          emailVerificationExpires: expires,
        },
      )) ?? createdUser;

    this.logger.info('Successful signup', {
      payload: { ...payload, password: '' },
      userId: user.id,
    });

    const devLink = this.deliverAuthLink(
      'verify-email',
      email,
      this.buildFrontendLink('/verify-email', token),
    );

    const tokens = this.getAuthTokens(user);
    return {
      message: 'Successfully signed up',
      data: { user, agent, tokens, ...(devLink ? { devLink } : {}) },
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.userService.findOne({ email, isDeleted: false });
    let devLink: string | undefined;

    if (user) {
      const { token, tokenHash, expires } = this.generateToken(
        PASSWORD_RESET_TTL_MS,
      );
      await this.userService.userDAL.updateOne(
        { _id: user.id },
        { passwordResetTokenHash: tokenHash, passwordResetExpires: expires },
      );
      devLink = this.deliverAuthLink(
        'reset-password',
        email,
        this.buildFrontendLink('/reset-password', token),
      );
    } else {
      this.logger.info('Password reset requested for unknown email');
    }

    return {
      message:
        'If an account exists for that email, a password reset link has been sent.',
      data: devLink ? { devLink } : {},
    };
  }

  async resetPassword(payload: ResetPasswordDto) {
    const user = await this.userService.userDAL.findOne({
      passwordResetTokenHash: this.hashToken(payload.token),
      passwordResetExpires: { gt: new Date() },
      isDeleted: false,
    });

    if (!user) {
      throw new CustomHttpException(
        'This password reset link is invalid or has expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(payload.password, 8);
    await this.userService.userDAL.updateOne(
      { _id: user.id },
      // A working reset link proves inbox ownership, so the email is verified too.
      { password: hashedPassword, loginAttempts: 0, isEmailVerified: true },
      {
        passwordResetTokenHash: true,
        passwordResetExpires: true,
      },
    );

    this.logger.info('Password reset completed', { userId: user.id });

    return { message: 'Your password has been reset. You can now sign in.' };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const user = await this.userService.userDAL.findOne({
      emailVerificationTokenHash: this.hashToken(payload.token),
      emailVerificationExpires: { gt: new Date() },
      isDeleted: false,
    });

    if (!user) {
      throw new CustomHttpException(
        'This verification link is invalid or has expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = await this.userService.userDAL.updateOne(
      { _id: user.id },
      { isEmailVerified: true },
      {
        emailVerificationTokenHash: true,
        emailVerificationExpires: true,
      },
    );

    this.logger.info('Email verified', { userId: user.id });

    const verified = updated ?? user;
    const tokens = this.getAuthTokens(verified);

    return {
      message: 'Your email has been verified',
      data: {
        email: verified.email,
        user: verified,
        tokens,
      },
    };
  }

  async resendVerification(payload: ResendVerificationDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.userService.findOne({ email, isDeleted: false });
    let devLink: string | undefined;

    if (user && !user.isEmailVerified) {
      const { token, tokenHash, expires } = this.generateToken(
        EMAIL_VERIFICATION_TTL_MS,
      );
      await this.userService.userDAL.updateOne(
        { _id: user.id },
        {
          emailVerificationTokenHash: tokenHash,
          emailVerificationExpires: expires,
        },
      );
      devLink = this.deliverAuthLink(
        'verify-email',
        email,
        this.buildFrontendLink('/verify-email', token),
      );
    }

    return {
      message:
        'If an unverified account exists for that email, a new verification link has been sent.',
      data: devLink ? { devLink } : {},
    };
  }

  private generateToken(ttlMs: number) {
    const token = randomBytes(32).toString('hex');
    return {
      token,
      tokenHash: this.hashToken(token),
      expires: new Date(Date.now() + ttlMs),
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private buildFrontendLink(path: string, token: string) {
    const base = (process.env.FRONTEND_URL || 'http://localhost:43122').replace(
      /\/+$/,
      '',
    );
    return `${base}${path}?token=${encodeURIComponent(token)}`;
  }

  /**
   * Delivers auth links via Resend (preferred), optional SMTP / webhook, or logs them.
   * Outside production, also returns the link so local FE can show DevLinkBox.
   * Set FRONTEND_URL in production so links point at the live site.
   */
  private deliverAuthLink(
    kind: 'verify-email' | 'reset-password',
    email: string,
    link: string,
  ): string | undefined {
    const isProduction = process.env.NODE_ENV === 'production';
    void this.sendAuthEmail(kind, email, link).catch((err) => {
      this.logger.warn(`Auth email delivery failed (${kind})`, {
        email,
        error: err instanceof Error ? err.message : String(err),
      });
    });
    this.logger.info(`Auth email link generated (${kind})`, {
      email,
      ...(isProduction ? {} : { link }),
    });
    return isProduction ? undefined : link;
  }

  private async sendAuthEmail(
    kind: 'verify-email' | 'reset-password',
    email: string,
    link: string,
  ) {
    if (this.mailService.isConfigured()) {
      const ok = await this.mailService.sendAuthLink(kind, email, link);
      if (ok) return;
    }

    const host = process.env.AUTH_SMTP_HOST;
    const user = process.env.AUTH_SMTP_USER;
    const pass = process.env.AUTH_SMTP_PASS;
    const from = process.env.AUTH_SMTP_FROM || user;
    if (!host || !user || !pass || !from) {
      if (!this.mailService.isConfigured()) {
        this.logger.warn('No Resend or SMTP configured — auth email not sent', {
          kind,
          email,
        });
      }
      return;
    }
    const subject =
      kind === 'reset-password'
        ? 'Reset your PropertyArena password'
        : 'Verify your PropertyArena email';
    const text =
      kind === 'reset-password'
        ? `Reset your password: ${link}\n\nIf you did not request this, ignore this email.`
        : `Verify your email: ${link}\n\nWelcome to PropertyArena.`;
    const webhook = process.env.AUTH_EMAIL_WEBHOOK;
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, from, subject, text, link, kind }),
      });
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const nodemailer = require('nodemailer') as {
        createTransport: (opts: Record<string, unknown>) => {
          sendMail: (opts: Record<string, unknown>) => Promise<unknown>;
        };
      };
      const transport = nodemailer.createTransport({
        host,
        port: Number(process.env.AUTH_SMTP_PORT || 587),
        secure: process.env.AUTH_SMTP_SECURE === 'true',
        auth: { user, pass },
      });
      await transport.sendMail({
        from,
        to: email,
        subject,
        text,
        html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
      });
    } catch {
      this.logger.warn(
        'SMTP configured but nodemailer unavailable; set RESEND_API_KEY or AUTH_EMAIL_WEBHOOK',
      );
    }
  }

  async login(payload: LoginDto) {
    const user = await this.userService.findOne(
      {
        email: payload.email.trim().toLowerCase(),
      },
      ['+password'],
    );

    const isValidPassword = await compare(
      payload.password,
      user?.password ?? '',
    );
    if (!user || !isValidPassword) {
      this.logger.info('Failed login attempt', {
        payload: { ...payload, password: '' },
        user,
      });

      throw new CustomHttpException(
        'invalid credentials',
        HttpStatus.FORBIDDEN,
      );
    }

    // const { password: '', ...safeUser } = user;
    const safeUser = { ...omit(user, ['password']) };
    const tokens = this.getAuthTokens(safeUser);
    this.logger.info('Successful login', {
      payload: { ...payload, password: '' },
      // user: { ...safeUser, password: '' },
    });
    return {
      message: 'Successfully logged in',
      data: { user: safeUser, tokens },
    };
  }

  getAuthTokens(user: Pick<User, 'id' | 'email'> & Partial<User>) {
    const payload = { ...pick(user, ['id', 'email']) };
    const accessToken = this.jwtService.sign(payload);
    // const accessTokenExpires = this.getExpirationDateFromToken(accessToken);

    return {
      accessToken,
    };
  }

  getExpirationDateFromToken(token: string) {
    try {
      const [, payload] = token.split('.');
      const parsedPayload = Buffer.from(`${payload}==`, 'base64').toString();
      const payloadJSON = JSON.parse(parsedPayload);

      return moment(payloadJSON.exp * 1000).toDate();
    } catch (error) {
      this.logger.error('Failed to parse token expiration date', { error });

      return new Date('Invalid Date');
    }
  }
}
