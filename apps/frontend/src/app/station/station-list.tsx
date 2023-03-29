import {useEffect, useState} from "react";
import axios from "axios";
import {Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow} from "@mui/material";

/* eslint-disable-next-line */
export interface StationListProps {}
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
export const  StationList = (props: StationListProps)  =>{
  const [stations, setStations] = useState<Station[]>([])
  const [stationCount, setStationCount] = useState(0)
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10
  });
  const hook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      console.log(response.data)
      const data = response.data
      setStations(data.items)
      setStationCount(data.meta.totalItems)
      console.log(stations)
    }
    const url = `/api/station?page=${controller.page+1}&limit=${controller.rowsPerPage}`
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
              Name
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
            <TableCell >
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

