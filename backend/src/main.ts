import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LocalizationInterceptor } from './common/interceptors/localization.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());

  // Security: Helmet headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    })
  );

  // Note: Authentication uses HttpOnly cookies (`access_token`).
  // See AuthController.setCookie logic.
  // Using HttpOnly cookies provides protection against XSS-based token theft.
  // CSRF protection is partially provided by SameSite=Lax.
  // For production, additional CSRF protection (e.g. middleware) is recommended
  // for state-changing routes (POST/PUT/DELETE).

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
      validationError: { target: false, value: false },
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Strict CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('GoldenLoft API')
    .setDescription('The GoldenLoft Pigeon Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LocalizationInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
