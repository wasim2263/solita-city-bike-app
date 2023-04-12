import React, {useEffect, useState} from "react";
import axios from "axios";
import {Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from "@mui/material";
import {Search} from "../search/search";
import AddBoxIcon from "@mui/icons-material/AddBox";

/* eslint-disable-next-line */
export interface StationListProps {
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

export const StationList = (props: StationListProps) => {
  const [stations, setStations] = useState<Station[]>([])
  const [stationCount, setStationCount] = useState(0)
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: ""
  });
  const hook = () => {
    let isSubscribed = true

    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      const data = response.data
      console.log(controller.search,isSubscribed)
      if (isSubscribed) {
        setStations(data.items)
        setStationCount(data.meta.totalItems)

      }
    }
    const url = `/api/stations?page=${controller.page + 1}&limit=${controller.rowsPerPage}&search=${controller.search}`
    const promise = axios.get(url)
    promise.then(eventHandler)
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
  const searchStation = (search: string) => {
    setController({...controller, search: search})
  }
  return (
    <Card>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span>Create new</span>
        <a href="stations/new/">
          <AddBoxIcon style={{marginLeft: '5px'}}/>
        </a>
      </div>
      <Search searchFunction={searchStation}/>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Station ID
            </TableCell>
            <TableCell>
              Address
            </TableCell>
            <TableCell>
              Departure Journies
            </TableCell>
            <TableCell>
              Return Journies
            </TableCell>
            <TableCell>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id}>
              <TableCell>
                {station.name}
              </TableCell>
              <TableCell>
                {station.station_id}
              </TableCell>
              <TableCell>
                {station.address}
              </TableCell>
              <TableCell>
                {station.departure_journeys_count}
              </TableCell>
              <TableCell>
                {station.return_journeys_count}
              </TableCell>

              <TableCell align='center'>
                <a target="_blank" href={`stations/${station.id}`}>View</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        onPageChange={handlePageChange}
        page={controller.page}
        count={stationCount}
        rowsPerPage={controller.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

