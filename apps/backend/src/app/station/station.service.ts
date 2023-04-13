import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateStationDto} from './dto/create-station.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

import {Journey} from "../journey/entities/journey.entity";

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {

  }

  async paginateStation(
    options: IPaginationOptions,
    search: string
  ): Promise<Pagination<Station>> {
    const queryBuilder = this.stationRepository.createQueryBuilder('stations')
      .loadRelationCountAndMap('stations.departure_journeys_count', 'stations.departure_journeys')
      .loadRelationCountAndMap('stations.return_journeys_count', 'stations.return_journeys');
    if (search != "") {
      queryBuilder.where('stations.name LIKE :searchTerm', {searchTerm: `%${search}%`})
        .orWhere('stations.address LIKE :searchTerm', {searchTerm: `%${search}%`})
        .orWhere('CAST(stations.station_id AS varchar) LIKE :searchTerm', {searchTerm: `%${search}%`})
        .orWhere('CAST(stations.capacities AS varchar) LIKE :searchTerm', {searchTerm: `%${search}%`})

    }
    return paginate<Station>(queryBuilder, options);
  }

  private formatData(data) {
    const stationData = {
      station_id: 0,
      name: "",
      address: "",
      capacities: 0,
      latitude: 0,
      longitude: 0
    }
    for (const [key, value] of Object.entries(data)) {
      if (key.trim() == 'ID') {
        stationData.station_id = <number>value;
      } else if (key.trim() == 'Name') {
        stationData.name = <string>value;
      } else if (key.trim() == 'Adress') {
        stationData.address = <string>value;
      } else if (key.trim() == 'Kapasiteet') {
        stationData.capacities = <number>value;
      } else if (key.trim() == 'y') {
        stationData.latitude = <number>value;
      } else if (key.trim() == 'x') {
        stationData.longitude = <number>value;
      }
    }
    return stationData;
  }

  async bulkCreate(data: CreateStationDto[]): Promise<void> {
    console.log('total data', data.length)
    let counter = 0;
    for (const row of data) {
      const stationData = this.formatData(row);
      counter++
      this.upsert(stationData);
      console.log('created station counter', counter);
    }
  }

  async upsert(createStationDto: CreateStationDto) {
    const station = await this.stationRepository.upsert(createStationDto, ['station_id']);
    return station;
  }

  create(createStationDto: CreateStationDto) {
    return this.stationRepository.save(createStationDto).catch(err => {
      console.log("Error", err.message);
      throw new HttpException({
        message: 'Failed to create station'
      }, HttpStatus.BAD_REQUEST);
    })
  }

  async findAll(page, limit, search) {
    return this.paginateStation({
      page,
      limit,
    }, search);
  }

  findOne(id: string) {
    console.log(id);
    return this.stationRepository.createQueryBuilder('stations')
      .where('stations.id = :id', {id: id})
      .getOne();
  }

  findOneByStationId(id: number) {
    console.log(id);
    return this.stationRepository.createQueryBuilder('stations')
      .where('stations.station_id = :id', {id: id})
      .getOne();
  }

  async getMonths(id: string) {
    const dateRange = await this.journeyRepository.createQueryBuilder('journeys')
      .where('journeys.departureStationId = :id', {id: id})
      .orWhere('journeys.returnStationId = :id', {id: id})
      .select('MIN(journeys.departed_at)')
      .addSelect('MAX(journeys.returned_at)')
      .getRawOne();
    const startDate = new Date(dateRange.min);
    const endDate = new Date(dateRange.max);
    // const yearDifference = endDate.getFullYear()- startDate.getFullYear()
    let totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    totalMonths -= startDate.getMonth();
    totalMonths += endDate.getMonth();
    endDate.setDate(31)
    startDate.setDate(1)
    console.log(startDate, endDate)
    console.log(startDate.getMonth(), endDate.getMonth(), dateRange, totalMonths)
// Initialize the array of months and years
    const months = [];
    for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
      const year = d.getFullYear();
      console.log(d)
      console.log(year)
      console.log(d.getUTCMonth())
      const month = d.toLocaleString('default', {month: 'long'});
      months.push(`${month} ${year}`);
      if (d.getFullYear() === endDate.getFullYear() && d.getMonth() === endDate.getMonth()) {
        break;
      }
    }

    return months
  }

  async getStatistics(id: string, month: string) {
    let startDate: null | Date
    let endDate: null | Date
    let dateMonth: null | Date
    if (month) {
      const [m, y] = month.split(' ');
      dateMonth = new Date(`${m} 1, ${y}`);
      startDate = new Date(dateMonth.getFullYear(), dateMonth.getMonth(), 1);
      endDate = new Date(dateMonth.getFullYear(), dateMonth.getMonth() + 1, 0, 23, 59);
    }

    let departureJourneyQuery = this.journeyRepository.createQueryBuilder('journeys')
      .where('journeys.departureStationId = :id', {id: id})
    let returnJourneyQuery = this.journeyRepository.createQueryBuilder('journeys')
      .where('journeys.returnStationId = :id', {id: id})
    let topFiveReturnStationsQuery = this.journeyRepository.createQueryBuilder('journeys')
      .where('journeys.departureStationId = :id', {id: id})
    let topFiveDepartureStationsQuery = this.journeyRepository.createQueryBuilder('journeys')
      .where('journeys.returnStationId = :id', {id: id})
    if (startDate && endDate) {
      departureJourneyQuery = departureJourneyQuery.andWhere("(journeys.departed_at BETWEEN :startDate AND :endDate or journeys.returned_at BETWEEN :startDate AND :endDate)", {
        startDate,
        endDate,
      });
      returnJourneyQuery = returnJourneyQuery.andWhere("(journeys.departed_at BETWEEN :startDate AND :endDate or journeys.returned_at BETWEEN :startDate AND :endDate)", {
        startDate,
        endDate,
      });

      topFiveReturnStationsQuery = topFiveReturnStationsQuery.andWhere("(journeys.departed_at BETWEEN :startDate AND :endDate or journeys.returned_at BETWEEN :startDate AND :endDate)", {
        startDate,
        endDate,
      });
      topFiveDepartureStationsQuery = topFiveDepartureStationsQuery
        .andWhere("(journeys.departed_at BETWEEN :startDate AND :endDate or journeys.returned_at BETWEEN :startDate AND :endDate)", {
          startDate,
          endDate,
        });
    }
    const departureJourney = await departureJourneyQuery
      .select('SUM(journeys.covered_distance)/1000', 'covered_distance')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.departureStationId')
      .getRawOne();
    const returnJourney = await returnJourneyQuery
      .select('SUM(journeys.covered_distance)/1000', 'covered_distance')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.returnStationId')
      .getRawOne();

    const topFiveReturnStations = await topFiveReturnStationsQuery
      .select('journeys.returnStationId', 'station_id')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.returnStationId')
      .orderBy('journey_count', 'DESC')
      .limit(5)
      .getRawMany();

    const topFiveDepartureStations = await topFiveDepartureStationsQuery.select('journeys.departureStationId', 'station_id')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.departureStationId')
      .orderBy('journey_count', 'DESC')
      .limit(5)
      .getRawMany();
    const stationIds = topFiveReturnStations.map(station =>
      station.station_id
    ).concat(topFiveDepartureStations.map(station =>
      station.station_id
    ))
    const topStationsData = await this.stationRepository.createQueryBuilder('stations')
      .whereInIds(stationIds)
      .getMany()


    return {
      departure_journey: departureJourney,
      return_journey: returnJourney,
      top_5_return_stations: topFiveReturnStations,
      top_5_departure_stations: topFiveDepartureStations,
      top_stations: topStationsData
    }
  }
}
