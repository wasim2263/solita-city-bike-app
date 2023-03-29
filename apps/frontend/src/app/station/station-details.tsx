import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

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
  const hook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      setStation(data)
    }
    const url = `/api/stations/${id}`
    const promise = axios.get(url)
    promise.then(eventHandler)
  }
  useEffect(hook, [id])
  return(
    <>
    <div>
    </div>
    </>
  );

}
