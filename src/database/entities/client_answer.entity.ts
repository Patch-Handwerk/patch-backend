import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ClientEvaluationAnswer } from './client_evaluation_answer.entity';
import { User } from './user.entity';

@Entity('client_answers')
export class ClientAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClientEvaluationAnswer)
  @JoinColumn({ name: 'answer_id' })
  answer: ClientEvaluationAnswer;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'tenant_id' })
  user: User;

  @Column()
  tenant_id: number; // Foreign key to users.tenant_id

  // Progress tracking fields
  @Column({ type: 'int', default: 0 })
  total_points: number;

  @Column({ type: 'int', default: 0 })
  progress: number; // Progress percentage

  // Level, stage, and description tracking
  @Column({ type: 'int', nullable: true })
  level: number | null;

  @Column({ type: 'varchar', nullable: true })
  stage: string | null;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  // Phase-specific tracking
  @Column({ type: 'varchar', nullable: true })
  phase_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  subphase_name: string | null;

  @Column({ type: 'int', nullable: true })
  question_id: number | null;

  @Column({ type: 'varchar', nullable: true })
  selected_answer_text: string | null;

  @Column({ type: 'int', nullable: true })
  selected_answer_point: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
