import {BaseEntity} from "../../common/base.entity";
import {Column, Entity, OneToMany} from "typeorm";
import {Journey} from "../../journey/entities/journey.entity";

@Entity()
export class Station extends BaseEntity {

  @Column('bigint', {default: 0, unique: true, unsigned: true})
  station_id: number;
  @Column({length: 500})
  name: string;
  @OneToMany(
    () => Journey,
    (journey) => journey.departure_station,
  )
  departure_journeys: Journey[];
  @OneToMany(
    () => Journey,
    (journey) => journey.return_station,
  )
  return_journeys: Journey[];
}
