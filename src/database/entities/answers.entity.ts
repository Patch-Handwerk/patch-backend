import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './questions.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string; 

  @Column({nullable:true})
  is_stop_answer: boolean;
  
  @Column()
  point: number;

  @ManyToOne(() => Question, question => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  // Level, stage, and description tracking
  @Column({ type: 'int', nullable: true })
  level: number | null;

  @Column({ type: 'varchar', nullable: true })
  stage: string | null;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}
