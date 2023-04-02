import {Injectable} from '@nestjs/common';
import {CreateStationDto} from './dto/create-station.dto';
import {UpdateStationDto} from './dto/update-station.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {groupBy} from "rxjs";

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
  ): Promise<Pagination<Station>> {
    const queryBuilder = this.stationRepository.createQueryBuilder('stations')
      .loadRelationCountAndMap('stations.departure_journeys_count', 'stations.departure_journeys')
      .loadRelationCountAndMap('stations.return_journeys_count', 'stations.return_journeys');
    return paginate<Station>(queryBuilder, options);
  }

  private formatData(data) {
    let stationData = {
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

  async bulkCreate(data: any[]) {
    //   {
    //     '﻿FID': '83',
    //     ID: '713',
    //     Nimi: 'Upseerinkatu',
    //     Namn: 'Officersgatan',
    //     Name: 'Upseerinkatu',
    //     Osoite: 'Upseerinkatu 3',
    //     Adress: 'Officersgatan 3',
    //     Kaupunki: 'Espoo',
    //     Stad: 'Esbo',
    //     Operaattor: 'CityBike Finland',
    //     Kapasiteet: '30',
    //     x: '24.819396',
    //     y: '60.216067'
    //   },
    console.log('total data', data.length)
    let counter = 0;
    for (const row of data) {
      let stationData = this.formatData(row);
      counter++
      this.create(stationData);
      console.log(counter);
    }
  }

  async create(createStationDto: CreateStationDto) {
    const station = await this.stationRepository.upsert(createStationDto, ['station_id']);
    return station;
  }

  async findAll(page, limit) {
    return this.paginateStation({
      page,
      limit,
    });
  }

  findOne(id: string) {
    console.log(id);
    return this.stationRepository.createQueryBuilder('stations')
      .where('stations.id = :id', {id: id})
      // .leftJoinAndSelect('stations.departure_journeys', 'stations.departure_journeys', )
      .getOne();
  }

  async getStatistics(id: string) {
    console.log(id);
    const journeyQueryBuilder = await this.journeyRepository.createQueryBuilder('journeys');
    const departureJourney = await journeyQueryBuilder
      .where('journeys.departureStationId = :id', {id: id})
      .select('SUM(journeys.covered_distance)/1000', 'covered_distance')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.departureStationId')
      .getRawOne();
    const returnJourney = await journeyQueryBuilder
      .where('journeys.returnStationId = :id', {id: id})
      .select('SUM(journeys.covered_distance)/1000', 'covered_distance')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.returnStationId')
      .getRawOne();
    const topFiveReturnStations = await journeyQueryBuilder
      .where('journeys.departureStationId = :id', {id: id})
      .select('journeys.returnStationId', 'station_id')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.returnStationId')
      .orderBy('journey_count', 'DESC')
      .limit(5)
      .getRawMany();
    const topFiveDepartureStations = await journeyQueryBuilder
      .where('journeys.returnStationId = :id', {id: id})
      .select('journeys.departureStationId', 'station_id')
      .addSelect('COUNT(journeys.id)', 'journey_count')
      .groupBy('journeys.departureStationId')
      .orderBy('journey_count', 'DESC')
      .limit(5)
      .getRawMany();
    let stationIds = topFiveReturnStations.map(station =>
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

  update(id: number, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  remove(id: number) {
    return `This action removes a #${id} station`;
  }

}
