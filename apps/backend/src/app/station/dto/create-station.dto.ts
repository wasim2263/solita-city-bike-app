import {StationInterface} from "../../../interfaces/station-interface";


export class CreateStationDto implements StationInterface{
  address?: string;
  capacities?: number;
  id?: string;
  latitude?: number;
  longitude?: number;
  name: string;
  station_id: number;
}
