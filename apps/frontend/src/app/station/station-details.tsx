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

}

type TopStation = { journey_count: string, name: string };

type Journey = {
  covered_distance: string;
  journey_count: string;
};

type Statistics = {
  departure_journey: Journey;
  return_journey: Journey;
  top_5_return_stations: TopStation[];
  top_5_departure_stations: TopStation[];
};
export const StationDetails = (props: StationDetailsProps) => {
  let {id} = useParams();
  const [station, setStation] = useState<Station>({
    name: "",
    address: "",
    capacities: 0,
    id: "",
  })
  const [departureJourney , setDepartureJourney] = useState<Journey>({
    covered_distance: "0",
    journey_count: "0"
  })
  const [returnJourney , setReturnJourney] = useState<Journey>({
    covered_distance: "0",
    journey_count: "0"
  })
  const [topFiveDepartureStations , setTopFiveDepartureStations] = useState<TopStation>()
  const [topFiveReturnStations , setTopFiveReturnStations] = useState<TopStation>()
  const stationDetailsHook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      setStation(data)
    }
    const url = `/api/stations/${id}`
    const promise = axios.get(url)
    promise.then(eventHandler)
  }
  useEffect(stationDetailsHook, [id])
  const stationStatisticsHook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      if(data.departure_journey){
        setDepartureJourney(data.departure_journey)
      }
      if(data.return_journey){
        setReturnJourney(data.return_journey)
      }
    }
    const url = `/api/stations/${id}/statistics`
    const promise = axios.get(url)
    promise.then(eventHandler)
  }
  useEffect(stationStatisticsHook, [id])
  return (
    <Card sx={{minWidth: 500}}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Station Name: {station.name}
        </Typography>
        <Typography variant="h6" sx={{mb: 1.5}} color="text.secondary" component="div">
          Address: {station.address}
        </Typography>
        <Typography color="text.secondary">
          Total number of journeys starting from the station: {departureJourney.journey_count}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          Total number of journeys ending at the station: {returnJourney.journey_count}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          The average distance of a journey starting from the
          station: {Number(departureJourney.journey_count) > 0? (Number(departureJourney.covered_distance) / Number(departureJourney.journey_count)).toFixed(2):"0"} km
        </Typography>

        <Typography sx={{mb: 1.5}} color="text.secondary">
          The average distance of a journey ending at the
          station: {Number(returnJourney.journey_count) > 0 ? (Number(returnJourney.covered_distance) / Number(returnJourney.journey_count)).toFixed(2):"0"} km
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );

}
