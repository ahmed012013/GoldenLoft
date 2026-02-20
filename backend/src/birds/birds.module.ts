import { Module } from '@nestjs/common';
import { BirdsController } from './birds.controller';
import { BirdsService } from './birds.service';
import { BirdsRepository } from './birds.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // السلكة الجديدة

@Module({
  imports: [PrismaModule, CloudinaryModule], // لازم نImport هنا
  controllers: [BirdsController],
  providers: [BirdsService, BirdsRepository],
  exports: [BirdsService],
})
export class BirdsModule {}
