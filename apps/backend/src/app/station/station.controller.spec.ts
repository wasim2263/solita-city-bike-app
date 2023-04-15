import {Test, TestingModule} from '@nestjs/testing';
import {StationController} from './station.controller';
import {StationService} from './station.service';
import {CreateStationDto} from './dto/create-station.dto';
import {FileUploadModule} from "../file-upload/file-upload.module";

describe('StationController', () => {
  let controller: StationController;
  let spyService: StationService;
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
      imports: [FileUploadModule],
      controllers: [StationController],
      providers: [ApiServiceProvider],
    }).compile();

    controller = module.get<StationController>(StationController);
    spyService = module.get<StationService>(StationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createStationDto = new CreateStationDto();
    it('should call stationService.create with correct dto', () => {
      expect(controller.create(createStationDto)).not.toEqual(null);
      expect(spyService.create).toHaveBeenCalled();
      expect(spyService.create).toHaveBeenCalledWith(createStationDto);
    });
  });

  describe('findOne', () => {
    it('should call stationService.findOne and stationService.getMonths with correct parameters', async () => {
      const id = 'dummy id';
      await controller.findOne(id);
      expect(spyService.findOne).toHaveBeenCalledWith(id);
      expect(spyService.getMonths).toHaveBeenCalledWith(id);
    });
  });
  describe('findAll', () => {
    it('should call stationService.findAll with correct parameters', async () => {
      const page = 1;
      const limit = 10;
      const search = 'dummy search';
      await controller.findAll(page, limit, search);
      expect(spyService.findAll).toHaveBeenCalledWith(page, limit, search);
    });
  });
  describe('getStatistics', () => {
    it('should call stationService.getStatistics with correct parameters', async () => {
      const id = 'dummy id';
      const month = 'dummy month';
      await controller.getStatistics(id, month);
      expect(spyService.getStatistics).toHaveBeenCalledWith(id, month);
    });
  });
});
