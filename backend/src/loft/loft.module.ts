import { Module } from '@nestjs/common';
import { LoftService } from './loft.service';
import { LoftController } from './loft.controller';

@Module({
  providers: [LoftService],
  controllers: [LoftController],
})
export class LoftModule {}
