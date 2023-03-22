import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({type: 'timestamp'})
  @Column({select:false})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamp'})
  @Column({select:false})
  updated_at: Date;

}
