import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherStation } from './db/tables/weather-station';
import { Variable } from './db/tables/variable';
import { Measurement } from './db/tables/measurement';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherStationsController } from './weather-stations.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [WeatherStation, Variable, Measurement],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([WeatherStation, Variable, Measurement]),
  ],
  controllers: [AppController, WeatherStationsController],
  providers: [AppService],
})
export class AppModule {}
