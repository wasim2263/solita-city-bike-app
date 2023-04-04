
export interface JourneyInterface {
  id: string;
  covered_distance: number;
  duration: number;
  departed_at: Date;
  returned_at: Date;
  departure_station?: Record<any, any>;
  return_station?: Record<any, any>;
}
