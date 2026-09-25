import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SkipAuth } from '@decorators/skip-auth.decorator';
import { CurrentUser } from '@decorators/currentUser.decorator';
import { AuthUser } from '@middlewares/auth.guard';
import { AdminGuard } from '@middlewares/admin.guard';
import { PlanUserType } from './schemas/subscription-plan.schema';
import {
  CheckoutDto,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from './dto/subscription.dto';
import { PaginationRequestDTO } from '@shared/pagination';
import { SUBSCRIPTION_STATUS } from './schemas/subscription.schema';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @SkipAuth()
  @Get('plans')
  getPlans(@Query('userType') userType?: PlanUserType) {
    return this.subscriptionService.listActivePlans(userType);
  }

  @SkipAuth()
  @Get('badge/:userId')
  getSubscriptionBadge(@Param('userId') userId: string) {
    return this.subscriptionService.getSubscriptionBadge(userId);
  }

  @Get('me')
  getMySubscription(@CurrentUser() user: AuthUser) {
    return this.subscriptionService.getMySubscription(user.id);
  }

  @Post('checkout')
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CheckoutDto) {
    return this.subscriptionService.initiateCheckout(
      user.id,
      user.email,
      dto.planId,
      dto.billingCycle,
      dto.redirectPath,
    );
  }

  /** UI-only confirm: re-verifies with gateway then activates (never trusts browser alone). */
  @Post('confirm')
  confirmPayment(
    @CurrentUser() user: AuthUser,
    @Body() body: { reference: string },
  ) {
    return this.subscriptionService.confirmCheckout(user.id, body.reference);
  }

  @UseGuards(AdminGuard)
  @Get('admin/subscribers')
  listSubscribers(@Query() query: PaginationRequestDTO) {
    return this.subscriptionService.listSubscribersAdmin(query);
  }

  @UseGuards(AdminGuard)
  @Get('admin/transactions')
  listTransactions(@Query() query: PaginationRequestDTO) {
    return this.subscriptionService.listTransactionsAdmin(query);
  }

  @UseGuards(AdminGuard)
  @Post('admin/:id/status')
  setSubscriptionStatus(
    @CurrentUser() admin: AuthUser,
    @Param('id') id: string,
    @Body() body: { status: SUBSCRIPTION_STATUS },
  ) {
    return this.subscriptionService.adminSetSubscriptionStatus(
      id,
      body.status,
      admin.id,
    );
  }

  @UseGuards(AdminGuard)
  @Get('plans/all')
  getAllPlansAdmin() {
    return this.subscriptionService.listAllPlansAdmin();
  }

  @UseGuards(AdminGuard)
  @Post('plans')
  createPlan(
    @CurrentUser() admin: AuthUser,
    @Body() dto: CreateSubscriptionPlanDto,
  ) {
    return this.subscriptionService.createPlan(dto, admin.id);
  }

  @UseGuards(AdminGuard)
  @Patch('plans/:id')
  updatePlan(
    @CurrentUser() admin: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionService.updatePlan(id, dto, admin.id);
  }
}
