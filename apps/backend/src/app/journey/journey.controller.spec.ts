import { Test, TestingModule } from '@nestjs/testing';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import {FileUploadModule} from "../file-upload/file-upload.module";
import {CreateJourneyDto} from "./dto/create-journey.dto";

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
      findAll: jest.fn((page, limit, search, orderBy,order) => {
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    const createJourneyDto = new CreateJourneyDto();
    it('should call journeyService.create with correct dto', () => {
      expect(controller.create(createJourneyDto)).not.toEqual(null);
      expect(spyService.create).toHaveBeenCalled();
      expect(spyService.create).toHaveBeenCalledWith(createJourneyDto);
    });
  });

  describe('findOne', () => {
    it('should call journeyService.findOne with correct parameters', async () => {
      const id = 'dummy id';
      await controller.findOne(id);
      expect(spyService.findOne).toHaveBeenCalledWith(id);
    });
  });
  describe('findAll', () => {
    it('should call journeyService.findAll with correct parameters', async () => {
      const page = 1;
      const limit = 10;
      const search = 'dummy search';
      const orderBy = '';
      const order = '';
      await controller.findAll(page, limit, search, orderBy,order);
      expect(spyService.findAll).toHaveBeenCalledWith(page, limit, search, orderBy,order);
    });
  });

});
