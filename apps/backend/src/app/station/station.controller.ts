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

@Controller('station')
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
    return this.stationService.findOne(id);
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
