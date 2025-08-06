import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ClientEvaluationQuestion } from './client_evaluation_question.entity';

@Entity()
export class ClientEvaluationAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @Column({nullable:true})
  is_stop_answer: boolean;
  
  @Column()
  point: number;

  @ManyToOne(() => ClientEvaluationQuestion, question => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: ClientEvaluationQuestion;

  // Level, stage, and description tracking
  @Column({ type: 'int', nullable: true })
  level: number | null;

  @Column({ type: 'varchar', nullable: true })
  stage: string | null;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}
