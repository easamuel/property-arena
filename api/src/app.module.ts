/* eslint-disable @typescript-eslint/unbound-method */
import { Global, Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import config from "./config/configuration";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "@middlewares/auth.guard";
import { TokenService } from "@helpers/jwt.token.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./modules/user/user.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import WebhookModule from "@modules/webhook/webhook.module";
import { BullModule } from "@nestjs/bullmq";
import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";
import * as crypto from "crypto";
import * as expressBasicAuth from "express-basic-auth";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { PropertyModule } from "./modules/property/property.module";
import { CategoryModule } from "./modules/category/category.module";
import { AuthModule } from "@modules/auth/auth.module";
import { loggingProvider } from "@shared/logger.provider";
import { AgentModule } from './modules/agent/agent.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AuditModule } from '@modules/audit/audit.module';
import { PlatformModule } from '@modules/platform/platform.module';
import { RequestsModule } from '@modules/requests/requests.module';
import { MailModule } from '@modules/mail/mail.module';
import { isQueuesEnabled } from '@shared/queues-enabled';

@Global()
@Module({
  providers: [loggingProvider],
  exports: [loggingProvider],
  imports: [AgentModule, SubscriptionModule],
})
class LoggingModule {}

const queuesOn = isQueuesEnabled();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    JwtModule.register({
      global: true,
      secret: config().jwt.secret,
      signOptions: { expiresIn: config().jwt.expiresIn as any },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL || config().database.url,
        connectionFactory(connection) {
          connection.plugin(mongoosePaginate);
          return connection;
        },
      }),
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory() {
        const { cache, isTest, redis } = config();
        if (isTest || !queuesOn || !redis.host || !redis.port) {
          return { ttl: cache.ttl };
        }

        return {
          host: redis.host,
          port: redis.port,
          ttl: cache.ttl,
          password: redis.password,
          store: redisStore,
          isCacheableValue(value) {
            return value !== undefined;
          },
        };
      },
    }),
    ...(queuesOn
      ? [
          BullModule.forRoot({
            connection: {
              host: config().redis.host,
              port: config().redis.port,
              password: config().redis.password,
            },
          }),
          BullBoardModule.forRoot({
            route: "/bull-board",
            middleware: expressBasicAuth({
              challenge: true,
              users: {
                admin:
                  process.env.BULL_BOARD_ADMIN_PASSWORD ||
                  crypto.randomBytes(32).toString("hex"),
              },
            }),
            adapter: ExpressAdapter,
          }),
        ]
      : []),
    ThrottlerModule.forRoot({ throttlers: [config().throttle] }),
    AuditModule,
    LoggingModule,
    MailModule,
    UserModule,
    AuthModule,
    WebhookModule,
    TransactionsModule,
    PropertyModule,
    CategoryModule,
    PlatformModule,
    RequestsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: "CONFIG",
      useClass: ConfigService,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TokenService,
  ],
})
export class AppModule {}
