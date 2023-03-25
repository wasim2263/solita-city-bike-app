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
import {useEffect} from "react";
import axios from "axios";
import * as process from "process";
/* eslint-disable-next-line */
export interface JourneyListProps {
}
type Journey ={

}
export const JourneyList = (props: JourneyListProps) => {
  const hook = () => {
    const eventHandler = (response: any) => {
      console.log('promise fulfilled')
      console.log(response.data)
      // const journies = response.data.map((journey: Journey) => createData(country.flags.svg, country.name.common, country.region, country.population, country.languages))
      // setCountries(countries)
      // setAllCountries(countries)
    }
    const url = `/api/journey`
    const promise = axios.get(url)
    promise.then(eventHandler)
  }
  useEffect(hook, [])
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Trips
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

        </TableBody>
      </Table>
      {/*<TablePagination />*/}
    </Card>
  );
}

