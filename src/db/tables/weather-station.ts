import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('weather_stations')
export class WeatherStation {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  site: string;

  @Column()
  portfolio: string;

  @Column()
  state: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;
}