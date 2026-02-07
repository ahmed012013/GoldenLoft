import { Module } from '@nestjs/common';
import { LoftService } from './loft.service';
import { LoftController } from './loft.controller';
import { LoftRepository } from './loft.repository';

@Module({
  controllers: [LoftController],
  providers: [LoftService, LoftRepository],
})
export class LoftModule {}
