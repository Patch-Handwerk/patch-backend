import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubPhase } from './sub_phase.entity';
import { Answer } from './answers.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  sortId: number;

  @OneToOne(() => SubPhase, subPhase => subPhase.question)
  @JoinColumn({ name: 'sub_phase_id' })
  subPhase: SubPhase;

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];
}
