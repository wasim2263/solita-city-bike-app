import {JourneyInterface} from "../../../interfaces/journey-interface";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsPositive} from "class-validator";

export class CreateJourneyDto implements Omit<JourneyInterface, 'id'> {

  @ApiProperty()
  @IsNotEmpty()
  departed_at: Date;

  @IsPositive()
  @ApiProperty({description: 'The ID of the return station. Must be a positive integer.'})
  @IsNotEmpty()
  departure_station_id: number;
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  duration: number;
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  covered_distance: number;
  @ApiProperty({description: 'The ID of the return station. Must be a positive integer.'})
  @IsPositive()
  @IsNotEmpty()
  return_station_id: number;
  @ApiProperty()
  @IsNotEmpty()
  returned_at: Date;
}
