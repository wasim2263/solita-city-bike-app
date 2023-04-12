
export interface StationInterface {
  id?: string;
  station_id: number;
  name: string;
  address?: string;
  capacities?: number;
  latitude?: number;
  longitude?: number;
  departure_journeys?: Record<any, any>;
  return_journeys?: Record<any, any>;
}


