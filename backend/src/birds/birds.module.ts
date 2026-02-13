import { Module } from '@nestjs/common';
import { BirdsService } from './birds.service';
import { BirdsController } from './birds.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BirdsRepository } from './birds.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BirdsController],
  providers: [BirdsService, BirdsRepository],
})
export class BirdsModule {}
