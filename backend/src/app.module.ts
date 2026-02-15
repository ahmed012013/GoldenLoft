import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // السلكة اللي كانت مقطوعة
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BirdsModule } from './birds/birds.module';
import { LoftModule } from './loft/loft.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // تكتة "عزوز": لازم دي تكون أول واحدة وعليها isGlobal
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    BirdsModule,
    LoftModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
