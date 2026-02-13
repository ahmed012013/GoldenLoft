import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { LoftModule } from './loft/loft.module';

import { HealthModule } from './health/health.module';
import { BirdsModule } from './birds/birds.module';
import { PairingsModule } from './pairings/pairings.module';
import { EggsModule } from './eggs/eggs.module';
import { LifeEventsModule } from './life-events/life-events.module';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string()
          .required()
          .min(10)
          .message('JWT_SECRET must be at least 10 characters long'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    LoftModule,
    BirdsModule,
    PairingsModule,
    EggsModule,
    LifeEventsModule,
    LifeEventsModule,
    HealthModule,
    TasksModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
