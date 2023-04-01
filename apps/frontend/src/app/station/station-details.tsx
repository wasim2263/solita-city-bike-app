import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";

export interface StationDetailsProps {
}
interface Station {
  id: string;
  name: string;
  address: string;
  capacities: number;
  departure_journeys_count: number;
  return_journeys_count: number;
}
export const StationDetails = (props: StationDetailsProps) =>{
  let {id} = useParams();
  const [station, setStation] = useState<Station>({
    name: "",
    address: "",
    capacities: 0,
    departure_journeys_count: 0,
    return_journeys_count: 0,
    id: "",
  })
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
    <Card sx={{ minWidth: 500 }}>
      <CardContent>
        <Typography  variant="h4" gutterBottom>
          Station Name: {station.name}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1.5 }}  color="text.secondary" component="div">
          Address: {station.address}
        </Typography>
        <Typography color="text.secondary">
          Total number of journeys starting from the station: {station.departure_journeys_count}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Total number of journeys ending at the station: {station.return_journeys_count}
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );

}
