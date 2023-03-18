import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JourneyModule } from './journey/journey.module';
import { StationModule } from './station/station.module';

@Module({
  imports: [JourneyModule, StationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
