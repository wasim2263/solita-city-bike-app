import {Column, Entity, ManyToOne} from "typeorm";
import {BaseEntity} from "../../common/base.entity";
import {Station} from "../../station/entities/station.entity";

@Entity()
export class Journey extends BaseEntity {
  @Column('float', {default: 0, comment: 'duration in meter'})
  covered_distance: number;
  @Column('integer', {default: 0, comment: 'duration in seconds'})
  duration: number;
  @Column({type: 'timestamp'})
  departed_at: Date;
  @Column({type: 'timestamp'})
  returned_at: Date;
  @ManyToOne((type) => Station, (departure_station) => departure_station.departure_journeys)
  departure_station: Station;
  @ManyToOne((type) => Station, (return_station) => return_station.return_journeys)
  return_station: Station;
}
