import {forwardRef, Module} from '@nestjs/common';
import {StationService} from './station.service';
import {StationController} from './station.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {FileUploadModule} from "../file-upload/file-upload.module";
import {Journey} from "../journey/entities/journey.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Station, Journey]),
    FileUploadModule,
  ],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService]
})
export class StationModule {
}
