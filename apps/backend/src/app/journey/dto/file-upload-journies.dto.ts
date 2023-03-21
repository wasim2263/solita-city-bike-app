import {ApiProperty} from "@nestjs/swagger";

export class FileUploadJourniesDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File
}
