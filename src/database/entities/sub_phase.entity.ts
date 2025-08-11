import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Phase } from "./phase.entity";
import { Question } from "./questions.entity";

@Entity('sub_phases')
export class SubPhase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Phase, { nullable: true })
  @JoinColumn({ name: 'parent_phase_id' })
  parentPhase: Phase;

  @OneToOne(() => Question, question => question.subPhase)
  question: Question;
}
