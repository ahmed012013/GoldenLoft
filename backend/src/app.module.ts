import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BirdsModule } from './birds/birds.module';
import { LoftModule } from './loft/loft.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
// 👇 السلوك اللي كانت مقطوعة يا هندسة
import { TasksModule } from './tasks/tasks.module';
import { PairingsModule } from './pairings/pairings.module';
import { InventoryModule } from './inventory/inventory.module';
import { HealthModule } from './health/health.module';
import { EggsModule } from './eggs/eggs.module';
import { LifeEventsModule } from './life-events/life-events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10000,
      },
    ]),
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
    AuthModule,
    UserModule,
    BirdsModule,
    LoftModule,
    CloudinaryModule,
    TasksModule,
    PairingsModule,
    InventoryModule,
    HealthModule,
    EggsModule,
    LifeEventsModule,
    NotificationsModule,
    NutritionModule,
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
export class AppModule { }
