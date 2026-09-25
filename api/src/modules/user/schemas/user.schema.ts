import { BaseSchema, Schema } from '@database/base.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum ROLE_ENUM {
  ADMIN = 'admin',
  USER = 'user',
  AGENT = 'agent',
  DEVELOPER = 'developer',
  LANDLORD = 'landlord',
}

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(ROLE_ENUM),
    default: ROLE_ENUM.USER,
  })
  @IsEnum(ROLE_ENUM)
  role: ROLE_ENUM;

  @Prop()
  @IsOptional()
  displayName?: string;

  @Prop()
  @IsOptional()
  phone?: string;

  @Prop()
  @IsOptional()
  address?: string;

  @Prop()
  @IsOptional()
  facebookUrl?: string;

  @Prop()
  @IsOptional()
  linkedinUrl?: string;

  @Prop()
  @IsOptional()
  country?: string;

  @Prop()
  @IsOptional()
  website?: string;

  @Prop()
  @IsOptional()
  avatarUrl?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization', required: false })
  @IsOptional()
  organization?: Types.ObjectId;

  @Prop({ default: new Date() })
  lastLoggedIn: Date;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ default: true })
  isActive: boolean;

  /** First-month-free promo may be used exactly once per user lifecycle. */
  @Prop({ default: false })
  promoTrialUsed: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ select: false, index: true, sparse: true })
  emailVerificationTokenHash?: string;

  @Prop({ select: false })
  emailVerificationExpires?: Date;

  @Prop({ select: false, index: true, sparse: true })
  passwordResetTokenHash?: string;

  @Prop({ select: false })
  passwordResetExpires?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
