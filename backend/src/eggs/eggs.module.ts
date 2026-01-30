import { Module } from '@nestjs/common';
import { EggsService } from './eggs.service';
import { EggsController } from './eggs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EggsController],
  providers: [EggsService],
  exports: [EggsService],
})
export class EggsModule {}
