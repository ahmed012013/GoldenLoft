import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    BirdsModule,
    LoftModule,
    CloudinaryModule,
    // 👇 ركب الموديولات هنا في "علبة الفيوزات" عشان يشتغلوا
    TasksModule,
    PairingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }