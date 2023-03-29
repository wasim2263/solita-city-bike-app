import styles from './journey-list.module.css';
import {
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from '@mui/material';
import {useEffect, useState} from "react";
import axios from "axios";
import * as process from "process";

/* eslint-disable-next-line */
export interface JourneyListProps {
}

interface Station {
  id: string;
  created_at: string;
  updated_at: string;
  station_id: string;
  name: string;
  address: string;
  capacities: number;
  latitude: number;
  longitude: number;
}

interface Journey {
  id: string;
  covered_distance: number;
  duration: number;
  departed_at: string;
  returned_at: string;
  departure_station: Station;
  return_station: Station;
}

export const JourneyList = (props: JourneyListProps) => {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [journeyCount, setJourneyCount] = useState(0)
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10
  });
  const hook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      console.log(response.data)
      const data = response.data
      setJourneys(data.items)
      setJourneyCount(data.meta.totalItems)
      console.log(journeys)
    }
    const url = `/api/journey?page=${controller.page+1}&limit=${controller.rowsPerPage}`
    const promise = axios.get(url)
    promise.then(eventHandler)
  }
  useEffect(hook, [controller])
  const handlePageChange = (event:any, newPage:number) => {
    setController({
      ...controller,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event:any) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Departed At
            </TableCell>
            <TableCell>
              Departure Station
            </TableCell>
            <TableCell>
              Returned At
            </TableCell>
            <TableCell>
              Return Station
            </TableCell>
            <TableCell>
              Duration (seconds)
            </TableCell>
            <TableCell >
              Distance Covered (kilometers)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {journeys.map((journey) => (
            <TableRow key={journey.id}>
              <TableCell>
                {journey.departed_at}
              </TableCell>
              <TableCell>
                {journey.departure_station.name}
              </TableCell>
              <TableCell>
                {journey.returned_at}
              </TableCell>
              <TableCell>
                {journey.return_station.name}
              </TableCell>
              <TableCell align='center'>
                {journey.duration}
              </TableCell>
              <TableCell align='center'>
                {journey.covered_distance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        onPageChange={handlePageChange}
        page={controller.page}
        count={journeyCount}
        rowsPerPage={controller.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

