import { Module } from '@nestjs/common';
import { PairingsService } from './pairings.service';
import { PairingsController } from './pairings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PairingsController],
  providers: [PairingsService],
})
export class PairingsModule {}
