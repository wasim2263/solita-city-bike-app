import {Test, TestingModule} from '@nestjs/testing';
import {StationService} from './station.service';
import {Repository} from "typeorm";
import {Journey} from "../journey/entities/journey.entity";
import {Station} from "./entities/station.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('StationService', () => {
  let service: StationService;
  let JourneyRepository: Repository<Journey>;
  let stationRepository: Repository<Station>;

  class StationRepositoryFake {
    public create(): void {
    }

    public async save(): Promise<void> {
    }

    public async remove(): Promise<void> {
    }

    public async findOne(): Promise<void> {
    }
  }

  class JourneyRepositoryFake {
    public create(): void {
    }

    public async save(): Promise<void> {
    }

    public async remove(): Promise<void> {
    }

    public async findOne(): Promise<void> {
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationService,
        {
          provide: getRepositoryToken(Station),
          useClass: StationRepositoryFake,
        }, {
          provide: getRepositoryToken(Journey),
          useClass: JourneyRepositoryFake,
        },
      ],
    }).compile();

    service = module.get<StationService>(StationService);
    JourneyRepository = module.get(getRepositoryToken(Journey));
    stationRepository = module.get(getRepositoryToken(Station));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
