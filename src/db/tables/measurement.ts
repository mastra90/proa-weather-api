import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('measurements')
export class Measurement {
  @PrimaryGeneratedColumn()
  measurement_id: number;

  @Column()
  station_id: number;

  @Column()
  variable_name: string;

  @Column('decimal', { precision: 10, scale: 4 })
  value: number;

  @Column('timestamp')
  timestamp: Date;
}
