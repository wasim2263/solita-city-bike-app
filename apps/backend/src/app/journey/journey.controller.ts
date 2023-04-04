import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UploadedFile, UseInterceptors, Query,
} from '@nestjs/common';
import {JourneyService} from './journey.service';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {UpdateJourneyDto} from './dto/update-journey.dto';
import {diskStorage} from 'multer';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiConsumes} from "@nestjs/swagger";
import {FileUploadJourniesDto} from "./dto/file-upload-journies.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@Controller('journeys')
export class JourneyController {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly fileUploadService: FileUploadService
  ) {
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() fileUploadJourniesDto: FileUploadJourniesDto, @UploadedFile() file: Express.Multer.File) {
    const csvData = await this.fileUploadService.uploadFile(file.buffer);
    this.journeyService.bulkCreate(csvData);
  }

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeyService.create(createJourneyDto);
  }

  @ApiImplicitQuery({
    name: "search",
    description: "search in the database",
    required: false,
    type: String
  })
  @ApiImplicitQuery({
    name: "orderBy",
    description: "orderBy field",
    required: false,
    type: String
  })
  @ApiImplicitQuery({
    name: "order",
    description: "order: asc|desc",
    required: false,
    type: String
  })
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = "",
    @Query('orderBy') orderBy = "",
    @Query('order') order = ""
  ) {
    return this.journeyService.findAll(page, limit, search,orderBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.journeyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJourneyDto: UpdateJourneyDto) {
    return this.journeyService.update(+id, updateJourneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journeyService.remove(+id);
  }
}
