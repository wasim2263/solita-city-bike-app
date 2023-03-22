import {Injectable} from '@nestjs/common';
import {CreateStationDto} from './dto/create-station.dto';
import {UpdateStationDto} from './dto/update-station.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>
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
      } else if (key.trim() == 'x') {
        stationData.latitude = <number>value;
      } else if (key.trim() == 'y') {
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

  findOne(id: number) {
    return `This action returns a #${id} station`;
  }

  update(id: number, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  remove(id: number) {
    return `This action removes a #${id} station`;
  }
}
