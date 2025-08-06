import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Phase } from "./phase.entity";
import { ClientEvaluationQuestion } from "./client_evaluation_question.entity";

@Entity('sub_phases')
export class SubPhase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Phase, { nullable: true })
  @JoinColumn({ name: 'parent_phase_id' })
  parentPhase: Phase;

  @OneToOne(() => ClientEvaluationQuestion, question => question.subPhase)
  question: ClientEvaluationQuestion;
}
