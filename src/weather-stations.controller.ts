import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  // Returns all stations with optional state filtering
  @Get()
  async getAllStations(@Query('states') states?: string) {
    if (states) {
      const stateArray = states.split(',');
      return await this.weatherStationRepo.find({
        where: {
          state: In(stateArray),
        },
      });
    }

    const stations = await this.weatherStationRepo.find();

    // console.log('Type: (Returns true if an array) ', Array.isArray(stations));
    // console.log('Length: (Returns number of stations) ', stations.length);
    // console.log('Return complete array: ', stations);
    return stations;
  }

  // Returns all variables with their long names and units
  @Get('variables')
  async getAllVariables() {
    const variables = await this.variableRepo.find();

    // console.log('Type: (Returns true if an array) ', Array.isArray(variables));
    // console.log('Length: (Returns number of variables) ', variables.length);
    // console.log('Return complete array: ', variables);

    return variables;
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

    // console.log('Type: (Returns true if an array) ', Array.isArray(latestMeasurements));
    // console.log('Length: (Returns number of variables) ', latestMeasurements.length);
    // console.log('Return complete array: ', latestMeasurements);

    return latestMeasurements;
  }
}
