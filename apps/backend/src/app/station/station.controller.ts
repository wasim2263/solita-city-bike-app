import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import {StationService} from './station.service';
import {CreateStationDto} from './dto/create-station.dto';
import {UpdateStationDto} from './dto/update-station.dto';
import {ApiConsumes} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {FileUploadStationsDto} from "./dto/file-upload-stations.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

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
  async uploadFile(@Body() fileUploadStationsDto: FileUploadStationsDto, @UploadedFile() file: Express.Multer.File) {
    const csvData = await this.fileUploadService.uploadFile(file.buffer);
    this.stationService.bulkCreate(csvData);
  }

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.stationService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const station = await  this.stationService.findOne(id);
    const months = await  this.stationService.getMonths(id);
    console.log(months)
    return {station:station, months:months}
  }
  @ApiImplicitQuery({
    name: "month",
    description: "The maximum number of transactions to return",
    required: false,
    type: String
  })
  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string, @Query('month') month?: string) {
    return this.stationService.getStatistics(id, month);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationService.update(+id, updateStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationService.remove(+id);
  }
}
