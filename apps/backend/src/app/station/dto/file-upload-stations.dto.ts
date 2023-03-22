import {ApiProperty} from "@nestjs/swagger";

export class FileUploadStationsDto{
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File
}
