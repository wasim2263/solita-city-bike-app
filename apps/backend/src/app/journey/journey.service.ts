import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {StationService} from "../station/station.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Journey} from "./entities/journey.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {CreateStationDto} from "../station/dto/create-station.dto";
import {Station} from "../station/entities/station.entity";
import {StationInterface} from "../../interfaces/station-interface";
import {JourneyInterface} from "../../interfaces/journey-interface";

@Injectable()
export class JourneyService {
  private stations: number[] = [];
  private stationIds: number[] = [];

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
    order: string,
  ): Promise<Pagination<Journey>> {
    const queryBuilder = this.journeyRepository.createQueryBuilder('journeys')
      .leftJoinAndSelect('journeys.departure_station', 'departure_station')
      .leftJoinAndSelect('journeys.return_station', 'return_station');
    if (search != "") {
      queryBuilder.where('departure_station.name ILIKE :searchTerm', {searchTerm: `%${search}%`})
        .orWhere('return_station.name ILIKE :searchTerm', {searchTerm: `%${search}%`})
      const dateSearch = new Date(search)
      if (dateSearch.toString() !== 'Invalid Date') {
        if (Number.isInteger(Number(search)) && search.length == 4) {
          queryBuilder.orWhere(`(date_part('year', journeys.departed_at) = :year)
  OR ( date_part('year', journeys.returned_at) = :year)`, {year: search,})
        } else if (search.replace(dateSearch.getFullYear().toString(), "").match(dateSearch.getDate().toString()) == null) {
          console.log('year month', dateSearch.getFullYear(), dateSearch.getMonth() + 1)
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
    if (orderBy.length > 0 && order.length > 0) {
      if (order === 'ASC' || order === 'DESC') {
        queryBuilder.orderBy(orderBy, order)
      }
    }

    return paginate<Journey>(queryBuilder, options);

  }

  private formatData(data): {
    returnStationData: StationInterface;
    departureStationData: StationInterface;
    journeyData: JourneyInterface
  } {
    const departureStationData: CreateStationDto = {
      name: "",
      station_id: 0
    }
    const returnStationData: CreateStationDto = {
      name: "",
      station_id: 0
    }
    const journeyData: CreateJourneyDto = {
      covered_distance: 0,
      duration: 0,
      departed_at: new Date(),
      returned_at: new Date(),
      departure_station_id: null,
      return_station_id: null
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

  async getOrCreateStation(stationData: CreateStationDto): Promise<Station> {
    let station;
    if (this.stationIds.includes(stationData.station_id)) {
      station = this.stations[stationData.station_id];
    } else {
      const insertedStation = await this.stationService.upsert(stationData);
      station = insertedStation.generatedMaps[0];
      if (station) {
        this.stations[station.station_id] = station;
        this.stationIds.push(station.station_id)
      }
    }
    return station;
  }

  async bulkCreate(data: any[]): Promise<void> {
    let journeys = []
    console.log('total data', data.length)
    let remaining = data.length;
    let counter = 0;
    for (const row of data) {
      const {returnStationData, departureStationData, journeyData} = this.formatData(row);
      if (journeyData.covered_distance < 10 && journeyData.duration < 10) {
        remaining--;
      } else {
        const departureStation = await this.getOrCreateStation(departureStationData);
        const returnStation = await this.getOrCreateStation(returnStationData);
        journeyData.departure_station = departureStation;
        journeyData.return_station = returnStation;
        journeys.push(journeyData);
        counter++;
      }

      if (counter == 10000 || counter == remaining) {
        this.journeyRepository.insert(journeys)
        remaining -= counter;
        // checking the counter
        console.log(counter, remaining)
        counter = 0;
        journeys = []
      }
    }

  }


  async create(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    const {departure_station_id, return_station_id} = createJourneyDto;

    const departureStation: Station = await this.stationService.findOneByStationId(departure_station_id);
    const returnStation: Station = await this.stationService.findOneByStationId(return_station_id);

    if (!departureStation || !returnStation) {
      throw new NotFoundException('Departure station or return station not found');
    }

    const journey = this.journeyRepository.create(createJourneyDto);
    journey.departure_station = departureStation;
    journey.return_station = returnStation;

    return this.journeyRepository.save(journey);
  }

  findAll(page: number, limit: number, search: string, orderBy: string, order: string): Promise<Pagination<Journey>> {
    return this.paginateJourney({
      page,
      limit,
    }, search, orderBy, order);
  }

  findOne(id: string): Promise<Journey | null> {
    return this.journeyRepository.findOne({where: {id: id}});
  }
}
