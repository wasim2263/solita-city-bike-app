import {JourneyInterface} from "../../../interfaces/journey-interface";
import {Station} from "../../station/entities/station.entity";
import {ApiProperty} from "@nestjs/swagger";

export class CreateJourneyDto implements Omit<JourneyInterface, 'id'>{
  @ApiProperty()
  covered_distance: number;
  @ApiProperty()
  departed_at: Date;
  @ApiProperty()
  departure_station: Station;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  return_station: Station;
  @ApiProperty()
  returned_at: Date;
}
