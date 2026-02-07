import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('Validation Errors:', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
      validationError: { target: false, value: false },
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // Security P0: Strict CORS
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

  console.log(
    'DATABASE_URL Present:',
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL.slice(0, 10) + '...'
      : 'FALSE'
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
