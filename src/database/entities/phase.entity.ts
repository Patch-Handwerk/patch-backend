import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { SubPhase } from "./sub_phase.entity";

@Entity('phases')
export class Phase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  translationKey: string | null;

  @OneToMany(() => SubPhase, subPhase => subPhase.parentPhase)
  subPhases: SubPhase[];
}
