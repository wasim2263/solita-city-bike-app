import {Injectable} from '@nestjs/common';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {UpdateJourneyDto} from './dto/update-journey.dto';
import csvParser from "csv-parser";
import validator from 'validator';
import {Station} from "../station/entities/station.entity";

@Injectable()
export class JourneyService {
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
      returned_at: new Date()
    }
    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
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
  async getOrCreateStation(departureStationData){

  }
  async bulkCreate(data: any[]) {
    const validRows = [];
    const invalidRows = [];
    for (const row of data) {
      let {returnStationData, departureStationData, journeyData} = this.formatData(row);
      console.log(returnStationData, departureStationData, journeyData)
      // const departureStation = await this.getOrCreateStation(departureStationData);

    }
    // const results = await this.csvModel.bulkCreate(validRows);
    // return {
    //   results,
    //   invalidRows,
    // };
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
