import { Test, TestingModule } from '@nestjs/testing';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import {FileUploadModule} from "../file-upload/file-upload.module";
import {StationService} from "../station/station.service";

describe('JourneyController', () => {
  let controller: JourneyController;
  let spyService: JourneyService
  const ApiServiceProvider = {
    provide: JourneyService,
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
      imports:[FileUploadModule],
      controllers: [JourneyController],
      providers: [ApiServiceProvider],
    }).compile();

    controller = module.get<JourneyController>(JourneyController);
    spyService = module.get<JourneyService>(JourneyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
