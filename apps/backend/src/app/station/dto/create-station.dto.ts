import {StationInterface} from "../../../interfaces/station-interface";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";


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
  name: string;
  @ApiProperty()
  station_id: number;
}
