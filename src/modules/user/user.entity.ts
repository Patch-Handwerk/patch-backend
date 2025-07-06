import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role,UserStatus } from '../admin/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CONSULTANT, })
  role: Role;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  user_status: UserStatus;

  // Add user entity for RESET TOKEN module
  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  // Add user entity for VERIFY EMAIL module
  @Column({ default: false })
  isVerified: boolean; // email confirmed?

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verificationTokenExpiry: Date | null;

  //Add user entity for REFRESH TOKEN module
  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;
}
