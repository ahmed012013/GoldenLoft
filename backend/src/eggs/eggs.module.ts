import { Module } from '@nestjs/common';
import { EggsService } from './eggs.service';
import { EggsController } from './eggs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EggsRepository } from './eggs.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EggsController],
  providers: [EggsService, EggsRepository],
  exports: [EggsService],
})
export class EggsModule {}
