import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role, UserStatus } from '../../modules/admin/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CONSULTANT })
  role: Role;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  user_status: UserStatus;

  // Add user entity for RESET TOKEN module
  @Column({ type: 'varchar', nullable: true })
  reset_token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expiry: Date | null;

  // Add user entity for VERIFY EMAIL module
  @Column({ default: false })
  is_verified: boolean; // email confirmed?

  @Column({ type: 'varchar', nullable: true })
  verification_token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expiry: Date | null;

  //Add user entity for REFRESH TOKEN module
  @Column({ type: 'text', nullable: true })
  refresh_token: string | null;

  // Onboarding completion flag
  @Column({ name: 'has_finished_onboarding', default: false })
  hasFinishedOnboarding: boolean;

  //Add user entity for OAuth module
  @Column({ type: 'varchar', nullable: true })
  provider: string | null; // OAuth provider name (e.g., 'google', 'facebook')

  @Column({ type: 'varchar', nullable: true })
  provider_id: string | null; // Unique ID from OAuth provider (e.g., '1234567890')

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null; //profile picture url (e.g., 'https://example.com/avatar.jpg')
}
