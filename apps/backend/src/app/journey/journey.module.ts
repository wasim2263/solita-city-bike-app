import {forwardRef, Module} from '@nestjs/common';
import {JourneyService} from './journey.service';
import {JourneyController} from './journey.controller';
import {StationModule} from "../station/station.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Journey} from "./entities/journey.entity";
import {FileUploadModule} from "../file-upload/file-upload.module";

@Module({
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([
      Journey]),
    forwardRef(()=>StationModule)
  ],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {
}
