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
    return paginate<Station>(queryBuilder, options );
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
