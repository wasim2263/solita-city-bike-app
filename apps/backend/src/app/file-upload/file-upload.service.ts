import { Injectable } from '@nestjs/common';
import csvParser from "csv-parser";

@Injectable()
export class FileUploadService {

  async uploadFile(buffer: Uint8Array): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      const stream = csvParser();
      stream.on('data', (data) => results.push(data));
      stream.on('end', () => resolve(results));
      stream.on('error', (error) => reject(error));
      stream.write(buffer);
      stream.end();
    });
  }
}
