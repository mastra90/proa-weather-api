import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('variables')
export class Variable {
  @PrimaryGeneratedColumn()
  var_id: number;

  @Column()
  id: number; // weather station id

  @Column()
  name: string;

  @Column()
  unit: string;

  @Column()
  long_name: string;
}
