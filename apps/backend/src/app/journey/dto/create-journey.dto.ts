import {JourneyInterface} from "../../../interfaces/journey-interface";
import {ApiProperty} from "@nestjs/swagger";
import {IsPositive} from "class-validator";

export class CreateJourneyDto implements Omit<JourneyInterface, 'id'> {

  @ApiProperty()
  departed_at: Date;

  @IsPositive()
  @ApiProperty({description: 'The ID of the return station. Must be a positive integer.'})
  departure_station_id: number;
  @ApiProperty()
  @IsPositive()
  duration: number;
  @ApiProperty()
  @IsPositive()
  covered_distance: number;
  @ApiProperty({description: 'The ID of the return station. Must be a positive integer.'})
  @IsPositive()
  return_station_id: number;
  @ApiProperty()
  returned_at: Date;
}
