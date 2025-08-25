import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Answer } from './answers.entity';
import { User } from './user.entity';

@Entity('results')
export class Results {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  user_id: number | null; // Foreign key to users.id

  // Progress tracking fields
  @Column({ type: 'int', default: 0 })
  total_points: number;

  @Column({ type: 'varchar', nullable: true })
  progress: string; // Progress percentage as string (e.g., "75%")

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
