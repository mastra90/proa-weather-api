import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherStation } from './db/tables/weather-station';
import { Measurement } from './db/tables/measurement';
import { Variable } from './db/tables/variable';

@Controller('weather-stations')
export class WeatherStationsController {
  constructor(
    @InjectRepository(WeatherStation)
    private weatherStationRepo: Repository<WeatherStation>,
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
    @InjectRepository(Variable)
    private variableRepo: Repository<Variable>,
  ) {}

  // Returns all stations
  @Get()
  async getAllStations() {
    return await this.weatherStationRepo.find();
  }

  // Returns single weather station with the latest measurements for each variable
  @Get(':id/latest')
  async getLatestMeasurements(@Param('id') id: string) {
    const stationId = parseInt(id);

    // Get all variable types for this station from variables table
    const variables = await this.variableRepo.find({
      where: { id: stationId },
    });

    const latestMeasurements: any[] = [];

    for (const variable of variables) {
      const latestMeasurement = await this.measurementRepo.findOne({
        where: {
          station_id: stationId,
          variable_name: variable.name,
        },
        order: { timestamp: 'DESC' },
      });

      if (latestMeasurement) {
        latestMeasurements.push({
          variable_name: variable.name,
          long_name: variable.long_name,
          unit: variable.unit,
          value: latestMeasurement.value,
          timestamp: latestMeasurement.timestamp,
        });
      }
    }

    return latestMeasurements;
  }
}
