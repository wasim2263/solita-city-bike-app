import {ApiProperty} from "@nestjs/swagger";

export class FileUploadJourniesDto {

  @ApiProperty({type: 'string', format: 'binary', required: true})
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  file: Express.Multer.File
}
