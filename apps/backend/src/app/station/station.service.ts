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
    return paginate<Station>(this.stationRepository, options, {
      relations: [],
      order: {created_at: 'DESC'},
    });
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
