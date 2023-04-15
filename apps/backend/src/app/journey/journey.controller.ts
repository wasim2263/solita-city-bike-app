import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile, UseInterceptors, Query, ParseUUIDPipe,
} from '@nestjs/common';
import {JourneyService} from './journey.service';
import {CreateJourneyDto} from './dto/create-journey.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiConsumes} from "@nestjs/swagger";
import {FileUploadJourneysDto} from "./dto/file-upload-journeys.dto";
import {FileUploadService} from "../file-upload/file-upload.service";
import {limit, orderByQuery, orderQuery, page, searchQuery} from "./decorators/api-params-decorators";
import {Journey} from "./entities/journey.entity";
import {Pagination} from "nestjs-typeorm-paginate";

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
  async uploadFile(
    @Body() fileUploadJourneysDto: FileUploadJourneysDto,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    const csvData = await this.fileUploadService.uploadFile(file.buffer);
    this.journeyService.bulkCreate(csvData);
  }

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto): Promise<Journey> {
    return this.journeyService.create(createJourneyDto);
  }

  @searchQuery
  @orderByQuery
  @orderQuery
  @page
  @limit
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = "",
    @Query('orderBy') orderBy = "",
    @Query('order') order = ""
  ): Promise<Pagination<Journey>> {
    return this.journeyService.findAll(page, limit, search, orderBy, order.toUpperCase());
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Journey> {
    return await this.journeyService.findOne(id);
  }
}
