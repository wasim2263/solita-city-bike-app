import {Test, TestingModule} from '@nestjs/testing';
import {StationService} from '../station/station.service';
import {JourneyService} from './journey.service';
import {Repository} from "typeorm";
import {Journey} from "./entities/journey.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('JourneyService', () => {
  let service: JourneyService;
  let stationService: StationService;
  let JourneyRepository: Repository<Journey>;

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
  const ApiServiceProvider = {
    provide: StationService,
    useFactory: () => ({
      create: jest.fn((dto) => {
        return dto;
      }),
      findOne: jest.fn((id) => {
        return {};
      }),
      findAll: jest.fn((page, limit, search) => {
        return {};
      }),
      getMonths: jest.fn((id) => {
        return {};
      }),

      getStatistics: jest.fn((id, month) => {
        return {};
      }),

    })
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JourneyService,
        ApiServiceProvider,
        {
        provide: getRepositoryToken(Journey),
        useClass: JourneyRepositoryFake,
      },],
    }).compile();

    service = module.get<JourneyService>(JourneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
