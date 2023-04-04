import {Injectable} from '@nestjs/common';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {UpdateJourneyDto} from './dto/update-journey.dto';
import {StationService} from "../station/station.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Journey} from "./entities/journey.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {Station} from "../station/entities/station.entity";

@Injectable()
export class JourneyService {
  private stations: [] = [];
  private stationIds: [] = [];

  constructor(
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
    private readonly stationService: StationService
  ) {
  }

  async paginateJourney(
    options: IPaginationOptions,
    search: string,
    orderBy: string,
    order: 'ASC'|'DESC',
  ): Promise<Pagination<Journey>> {
    const queryBuilder = this.journeyRepository.createQueryBuilder('journeys')
      .leftJoinAndSelect('journeys.departure_station', 'departure_station')
      .leftJoinAndSelect('journeys.return_station', 'return_station');
    console.log('searching...s...', search)
    if (search != "") {
      console.log('searching...st...', search)
      queryBuilder.where('departure_station.name ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .orWhere('return_station.name ILIKE :searchTerm', {searchTerm: `%${search}%`})
      const dateSearch = new Date(search)
      console.log(dateSearch)
      if (dateSearch.toString() !== 'Invalid Date') {
        console.log('searching......', dateSearch)
        if (Number.isInteger(Number(search)) && search.length == 4) {
          queryBuilder.orWhere(`(date_part('year', journeys.departed_at) = :year)
  OR ( date_part('year', journeys.returned_at) = :year)`, {year: search,})
        } else if (search.replace(dateSearch.getFullYear(), "").match(dateSearch.getDate()) == null) {
          console.log('year month',  dateSearch.getFullYear(), dateSearch.getMonth() + 1)
          queryBuilder.orWhere(`(
    date_part('year', journeys.departed_at) = :year
    AND date_part('month', journeys.departed_at) = :month
  )
  OR (
    date_part('year', journeys.returned_at) = :year
    AND date_part('month', journeys.returned_at) = :month
  )`, {
            year: dateSearch.getFullYear(),
            month: dateSearch.getMonth() + 1,
          })

        } else {
          queryBuilder.orWhere('journeys.departed_at BETWEEN :startDate AND :endDate', {
            startDate: new Date(`${search} 00:00:00`),
            endDate: new Date(`${search} 23:59:59`),
          })
            .orWhere('journeys.returned_at BETWEEN :startDate AND :endDate', {
              startDate: new Date(`${search} 00:00:00`),
              endDate: new Date(`${search} 23:59:59`),
            })
        }

      }
    }
    if(orderBy.length>0 && order.length>0){
      queryBuilder.orderBy(orderBy, order)
    }

    return paginate<Journey>(queryBuilder, options);

  }

  private formatData(data) {
    let departureStationData: { station_id: number; name: string } = {
      name: "",
      station_id: 0
    }
    let returnStationData: { station_id: number; name: string } = {
      name: "",
      station_id: 0
    }
    let journeyData = {
      covered_distance: 0,
      duration: 0,
      departed_at: new Date(),
      returned_at: new Date(),
      departure_station: null,
      return_station: null
    }
    for (const [key, value] of Object.entries(data)) {
      // console.log(`${key}: ${value}`);
      if (key.trim() == 'Departure station id') {
        departureStationData.station_id = <number>value;
      } else if (key.trim() == 'Departure station name') {
        departureStationData.name = <string>value;
      } else if (key.trim() == 'Return station id') {
        returnStationData.station_id = <number>value;
      } else if (key.trim() == 'Return station name') {
        returnStationData.name = <string>value;
      } else if (key.trim() == 'Covered distance (m)') {
        journeyData.covered_distance = Math.abs(<number>value);
      } else if (key.trim() == 'Duration (sec.)') {
        journeyData.duration = Math.abs(<number>value);
      } else if (key.trim() == 'Departure') {
        journeyData.departed_at = <Date>value;
      } else if (key.trim() == 'Return') {
        journeyData.returned_at = <Date>value;
      }
    }
    return {returnStationData, departureStationData, journeyData}
  }

  async getOrCreateStation(departureStationData: any) {
    // console.log(this.oldStations);
    let station;
    if (this.stationIds.includes(departureStationData.station_id)) {
      station = this.stations[departureStationData.station_id];
    } else {
      const insertedStation = await this.stationService.create(departureStationData);
      station = insertedStation.generatedMaps[0];
      this.stations[station.station_id] = station;
      this.stationIds.push(station.station_id)
    }
    return station;
  }

  async bulkCreate(data: any[]) {
    // this.oldStations = await this.stationService.findAll()
    const validRows = [];
    const invalidRows = [];
    let journeys = []
    console.log('total data', data.length)
    let remaining = data.length;
    let counter = 0;
    for (const row of data) {
      let {returnStationData, departureStationData, journeyData} = this.formatData(row);
      if (journeyData.covered_distance < 10 && journeyData.duration < 10) {
        remaining--;
      } else {
        // console.log(returnStationData, departureStationData, journeyData)
        const departureStation = await this.getOrCreateStation(departureStationData);
        const returnStation = await this.getOrCreateStation(returnStationData);
        journeyData.departure_station = departureStation;
        journeyData.return_station = returnStation;
        journeys.push(journeyData);
        counter++;
      }

      if (counter == 10000 || counter == remaining) {
        console.log(counter, remaining)
        this.journeyRepository.insert(journeys)
        remaining -= counter;
        console.log(counter, remaining)
        counter = 0;
        journeys = []
      }
    }

  }

  bulkStore(journeys: any[]) {
    this.journeyRepository.insert(journeys);
  }

  create(createJourneyDto: CreateJourneyDto) {
    return 'This action adds a new journey';
  }

  findAll(page, limit, search, orderBy, order) {
    // return 'wasim'
    return this.paginateJourney({
      page,
      limit,
    }, search, orderBy, order.toUpperCase());
  }

  findOne(id: number) {
    return `This action returns a #${id} journey`;
  }

  update(id: number, updateJourneyDto: UpdateJourneyDto) {
    return `This action updates a #${id} journey`;
  }

  remove(id: number) {
    return `This action removes a #${id} journey`;
  }
}
