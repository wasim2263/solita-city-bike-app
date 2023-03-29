import {useParams} from "react-router-dom";
import {useState} from "react";

export interface StationDetailsProps {
}
interface Station {
  id: string;
  created_at: string;
  updated_at: string;
  station_id: string;
  name: string;
  address: string;
  capacities: number;
  departure_journeys_count: number;
  return_journeys_count: number;
}
export const StationDetails = (props: StationDetailsProps) =>{
  let {id} = useParams();
  const [station, setStation] = useState<Station>()

  return(
    <>
    <div>
    </div>
    </>
  );

}
