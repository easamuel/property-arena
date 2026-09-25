import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { BullBoardConfig } from './config/bullboard.config';
// import { Queue } from "bullmq";
// import { getQueueToken } from "@nestjs/bullmq";
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@middlewares/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { ensureLocalInfra } from './local-infra';
import { seedDevData } from './seed-dev';
import { seedNationwideProperties } from './database/seeds/properties.seed';

async function bootstrap() {
  await ensureLocalInfra();
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  app.use(
    express.json({
      verify: (req: express.Request, res: express.Response, buf: Buffer) => {
        if (req.url.includes('/webhook')) {
          (req as any).rawBody = buf;
        }
      },
    }),
  );
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  // app.enableCors();
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Property Arena Wallet')
    .setDescription('API documentation for Property Arena')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<string>('PORT');

  BullBoardConfig(app, []);

  const listenPort = port || config.get('port') || 43121;
  const server = await app.listen(listenPort);
  server.setTimeout(1200000);
  logger.log('Server started on port ' + listenPort);

  if (process.env.NODE_ENV !== 'production') {
    try {
      await seedDevData(app);
      await seedNationwideProperties(app);
      logger.log('Dev seed ready (admin + plans + properties)');
    } catch (err) {
      logger.warn('Dev seed skipped: ' + (err as Error).message);
    }
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
