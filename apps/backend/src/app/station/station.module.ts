import {Module} from '@nestjs/common';
import {StationService} from './station.service';
import {StationController} from './station.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {FileUploadModule} from "../file-upload/file-upload.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
    FileUploadModule
  ],
  controllers: [StationController],
  providers: [StationService],
  exports:[StationService]
})
export class StationModule {
}
