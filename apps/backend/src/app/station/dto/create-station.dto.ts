import {StationInterface} from "../../../interfaces/station-interface";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";


export class CreateStationDto implements Omit<StationInterface, 'id'> {
  @ApiPropertyOptional()
  address?: string;
  @ApiPropertyOptional()
  capacities?: number;
  @ApiPropertyOptional()
  latitude?: number;
  @ApiPropertyOptional()
  longitude?: number;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  station_id: number;
}
