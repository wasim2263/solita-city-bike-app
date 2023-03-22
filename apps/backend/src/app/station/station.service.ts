import {Injectable} from '@nestjs/common';
import {CreateStationDto} from './dto/create-station.dto';
import {UpdateStationDto} from './dto/update-station.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Station} from "./entities/station.entity";
import {Repository} from "typeorm";

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>
  ) {

  }

  async create(createStationDto: CreateStationDto) {
    const station = await this.stationRepository.upsert(createStationDto, ['station_id']);
    return station;
  }

  async findAll() {
    const stations = await this.stationRepository.find();
    return stations;
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
