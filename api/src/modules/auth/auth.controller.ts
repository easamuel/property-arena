import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateAuthDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
} from "./dto/auth.dto";
import { SkipAuth } from "@decorators/skip-auth.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post("signup")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @SkipAuth()
  @Post("login")
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post("forgot-password")
  forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  resetPassword(@Body() payload: ResetPasswordDto) {
    return this.authService.resetPassword(payload);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post("verify-email")
  verifyEmail(@Body() payload: VerifyEmailDto) {
    return this.authService.verifyEmail(payload);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post("resend-verification")
  resendVerification(@Body() payload: ResendVerificationDto) {
    return this.authService.resendVerification(payload);
  }
}
