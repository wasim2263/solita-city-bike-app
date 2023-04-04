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
import TableSortLabel from '@mui/material/TableSortLabel';

import {useEffect, useState} from "react";
import axios from "axios";
import * as process from "process";
import {Search} from "../search/search";

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

type PaginationSearchParams = {
  page: number;
  rowsPerPage: number;
  search: string;
  orderBy: string;
  order: string;
};
export const JourneyList = (props: JourneyListProps) => {
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [journeyCount, setJourneyCount] = useState(0)
  const [controller, setController] = useState<PaginationSearchParams>({
    page: 0,
    rowsPerPage: 10,
    search: "",
    order: "",
    orderBy: ""
  });
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>("asc");
  const hook = () => {
    let isSubscribed = true
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      console.log(controller.search, isSubscribed)
      if (isSubscribed) {
        setJourneys(data.items)
        setJourneyCount(data.meta.totalItems)
      }
    }
    const url = `/api/journeys?page=${controller.page + 1}&limit=${controller.rowsPerPage}&search=${controller.search}&orderBy=${controller.orderBy}&order=${controller.order}`
    const promise = axios.get(url)
    promise.then(eventHandler)
    console.log(controller)
    return () => {
      isSubscribed = false
    }
  }
  useEffect(hook, [controller])
  const handlePageChange = (event: any, newPage: number) => {
    setController({
      ...controller,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  };
  const searchJourney = (search: string) => {
    setController({...controller, search: search})
  }
  const handleSort = (property: string) => () => {
    const isAsc = orderBy === property && order === "asc";
    const orderType: 'asc' | 'desc' = isAsc ? "desc" : "asc"
    setOrder(orderType);
    setOrderBy(property);
    setController({...controller, order: orderType, orderBy: property})


  };
  return (
    <Card>
      <Search searchFunction={searchJourney}/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "departed_at"}
                direction={order}
                onClick={handleSort("departed_at")}
              >
                Departed At
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "departure_station.name"}
                direction={order}
                onClick={handleSort("departure_station.name")}
              >
                Departure Station
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "returned_at"}
                direction={order}
                onClick={handleSort("returned_at")}
              >
                Returned At
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "return_station.name"}
                direction={order}
                onClick={handleSort("return_station.name")}
              >
                Return Station
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "duration"}
                direction={order}
                onClick={handleSort("duration")}
              >
                Duration (minutes)
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "covered_distance"}
                direction={order}
                onClick={handleSort("covered_distance")}
              >
                Distance Covered (kilometers)
              </TableSortLabel>
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

