import {BaseEntity} from "../../common/base.entity";
import {Column, Entity, OneToMany} from "typeorm";
import {Journey} from "../../journey/entities/journey.entity";

@Entity()
export class Station extends BaseEntity {

  @Column('bigint', {default: 0, unique: true, unsigned: true})
  station_id: number;
  @Column({length: 500})
  name: string;
  @Column({length: 500, nullable: true})
  address: string;
  @Column('float', {nullable: true})

  latitude: number;
  @Column('integer', {default: 0})
  capacities: number;
  @Column('float', {nullable: true})
  longitude: number;
  @OneToMany(
    () => Journey,
    (journey) => journey.departure_station,
    {
      eager: true,
    }
  )
  departure_journeys: Journey[];
  @OneToMany(
    () => Journey,
    (journey) => journey.return_station, {
      eager: true,
    }
  )
  return_journeys: Journey[];
}
