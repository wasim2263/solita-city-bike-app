import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import {StationModule} from "../station/station.module";

@Module({
  // imports:[StationModule],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {}
