import { Module } from '@nestjs/common';
import { ScrambleService } from './scramble.service';
import { ScrambleController } from './scramble.controller';

@Module({
  controllers: [ScrambleController],
  providers: [ScrambleService],
})
export class ScrambleModule {}
