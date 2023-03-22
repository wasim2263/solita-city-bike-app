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

@Controller('journey')
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() fileUploadJourniesDto: FileUploadJourniesDto, @UploadedFile() file: Express.Multer.File) {
    const csvData = await this.journeyService.uploadFile(file.buffer);
    this.journeyService.bulkCreate(csvData);
  }

  @Post()
  create(@Body() createJourneyDto: CreateJourneyDto) {
    return this.journeyService.create(createJourneyDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.journeyService.findAll(page,limit);
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
