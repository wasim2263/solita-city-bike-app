import {Inject, Injectable} from '@nestjs/common';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {UpdateJourneyDto} from './dto/update-journey.dto';
import csvParser from "csv-parser";
import {StationService} from "../station/station.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Journey} from "./entities/journey.entity";

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

  async uploadFile(buffer: Uint8Array): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      const stream = csvParser();
      stream.on('data', (data) => results.push(data));
      stream.on('end', () => resolve(results));
      stream.on('error', (error) => reject(error));
      stream.write(buffer);
      stream.end();
    });
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
        journeyData.covered_distance = <number>value;
      } else if (key.trim() == 'Duration (sec.)') {
        journeyData.duration = <number>value;
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
      // console.log(returnStationData, departureStationData, journeyData)
      const departureStation = await this.getOrCreateStation(departureStationData);
      const returnStation = await this.getOrCreateStation(returnStationData);
      journeyData.departure_station = departureStation;
      journeyData.return_station = returnStation;
      journeys.push(journeyData);
      counter++;
      if (counter == 10000 || counter==remaining) {
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

  findAll() {
    return `This action returns all journey`;
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
