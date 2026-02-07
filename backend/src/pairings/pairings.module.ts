import { Module } from '@nestjs/common';
import { PairingsService } from './pairings.service';
import { PairingsController } from './pairings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PairingsRepository } from './pairings.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PairingsController],
  providers: [PairingsService, PairingsRepository],
})
export class PairingsModule {}
