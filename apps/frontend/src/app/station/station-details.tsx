import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { Card, CardContent, Typography} from "@mui/material";
import {Map} from "./google-map";


interface Station {
  id: string;
  name: string;
  address: string;
  capacities: number;
  latitude: number;
  longitude: number;

}

type TopStation = { journey_count: string, name: string, id: string };

type Journey = {
  covered_distance: number;
  journey_count: string;
};

type StationWithCount = {
  station_id: string;
  journey_count: string;
};

export const StationDetails = () => {
  const {id} = useParams();
  const [station, setStation] = useState<Station>({
    name: "",
    address: "",
    capacities: 0,
    id: "",
    latitude: 0,
    longitude: 0
  })
  const [departureJourney, setDepartureJourney] = useState<Journey>({
    covered_distance: 0,
    journey_count: "0"
  })
  const [returnJourney, setReturnJourney] = useState<Journey>({
    covered_distance: 0,
    journey_count: "0"
  })
  const [topFiveDepartureStations, setTopFiveDepartureStations] = useState<TopStation[]>([])
  const [topFiveReturnStations, setTopFiveReturnStations] = useState<TopStation[]>([])
  const [allMonths, setAllMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState('');

  const stationDetailsHook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      setStation(data.station)
      setAllMonths(data.months)
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
      if (data.departure_journey) {
        setDepartureJourney(data.departure_journey)
      }
      if (data.return_journey) {
        setReturnJourney(data.return_journey)
      }
      const buildTopFiveDepartureStations = data.top_5_departure_stations.map((station: StationWithCount) => {
        const matchedStation = data.top_stations.find((s: Station) => s.id === station.station_id);
        return {
          id: station.station_id,
          journey_count: station.journey_count,
          name: matchedStation ? matchedStation.name : "Unknown Station"
        }
      });

      const buildTopFiveReturnStations = data.top_5_return_stations.map((station: StationWithCount) => {
        const matchedStation = data.top_stations.find((s: Station) => s.id === station.station_id);
        return {
          id: station.station_id,
          journey_count: station.journey_count,
          name: matchedStation ? matchedStation.name : "Unknown Station"
        }
      });
      console.log(station)
      setTopFiveDepartureStations(buildTopFiveDepartureStations);
      setTopFiveReturnStations(buildTopFiveReturnStations);
    }
    let url = `/api/stations/${id}/statistics`
    if(selectedMonth != 'all'){
      url +=`?month=${selectedMonth}`
    }
    const promise = axios.get(url)
    promise.then(eventHandler)

  }

  useEffect(stationStatisticsHook, [selectedMonth])
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <Card sx={{minWidth: 500}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Station Name: {station.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" component="div">
            Address: {station.address}
          </Typography>
          <Typography sx={{mt: 3, mb: 1.5}} color="text.secondary">
            Statistics:
            <select id="options" value={selectedMonth} onChange={handleOptionChange}>
              <option value="all">All</option>
              {allMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </Typography>
          <Typography sx={{mt: 1.5}} color="text.secondary">
            Total number of journeys starting from the station: {departureJourney.journey_count}
          </Typography>
          <Typography color="text.secondary">
            Total number of journeys ending at the station: {returnJourney.journey_count}
          </Typography>
          <Typography sx={{mt: 1.5}} color="text.secondary">
            The average distance of a journey starting from the
            station: {Number(departureJourney.journey_count) > 0 ? (Number(departureJourney.covered_distance) / Number(departureJourney.journey_count)).toFixed(2) : "0"} km
          </Typography>

          <Typography color="text.secondary">
            The average distance of a journey ending at the
            station: {Number(returnJourney.journey_count) > 0 ? (Number(returnJourney.covered_distance) / Number(returnJourney.journey_count)).toFixed(2) : "0"} km
          </Typography>
          <Typography sx={{mt: 1.5}} color="text.secondary">
            Top 5 most popular return stations for journeys starting from the
            station:
            <ul>
              {topFiveReturnStations.map(station => <li
                key={station.id}>{station.name} ({station.journey_count} times),</li>)}
            </ul>
          </Typography>
          <Typography sx={{mt: 1.5}} color="text.secondary">
            Top 5 most popular departure stations for journeys ending at the
            station:
            <ul> {topFiveDepartureStations.map(station => <li
              key={station.id}>{station.name} ({station.journey_count} times),</li>)}
            </ul>
          </Typography>


        </CardContent>

      </Card>
      {station.latitude !== 0 && station.longitude !== 0 ?
        <Map center={{lat: station.latitude, lng: station.longitude}}/> : <></>}
    </div>
  );

}
