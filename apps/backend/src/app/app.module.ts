import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JourneyModule } from './journey/journey.module';
import { StationModule } from './station/station.module';
import {Station} from "./station/entities/station.entity";
import {Journey} from "./journey/entities/journey.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Station,
        Journey
      ],
      synchronize: true,
    }),
    StationModule,
    JourneyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
