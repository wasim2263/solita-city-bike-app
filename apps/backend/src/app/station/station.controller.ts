import {
  Controller,
  Get,
  Post,
  Body,
  Param, Query, UseInterceptors, UploadedFile, ParseUUIDPipe,
} from '@nestjs/common';
import {StationService} from './station.service';
import {CreateStationDto} from './dto/create-station.dto';
import {ApiConsumes} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {FileUploadStationsDto} from "./dto/file-upload-stations.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import {filterByMonth, limit, page, searchQuery} from "./decorators/api-params-decorators";
import {Pagination} from "nestjs-typeorm-paginate";
import {Station} from "./entities/station.entity";
import {IsUUID} from "class-validator";

@Controller('stations')
export class StationController {
  constructor(
    private readonly stationService: StationService,
    private readonly fileUploadService: FileUploadService
  ) {
  }


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() fileUploadStationsDto: FileUploadStationsDto,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    const csvData = await this.fileUploadService.uploadFile(file.buffer);
    this.stationService.bulkCreate(csvData);
  }

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @searchQuery
  @limit
  @page
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = ""
  ): Promise<Pagination<Station>> {
    return this.stationService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const station = await this.stationService.findOne(id);
    const months = await this.stationService.getMonths(id);
    console.log(months)
    return {station: station, months: months}
  }

  @filterByMonth
  @Get(':id/statistics')
  async getStatistics(@Param('id', ParseUUIDPipe) id: string, @Query('month') month?: string) {
    return this.stationService.getStatistics(id, month);
  }
}
