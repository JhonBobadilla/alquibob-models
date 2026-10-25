import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { OAuthProvider } from '../enums/oauth-provider.enum';

export { OAuthProvider };

@Entity('oauth_accounts')
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column({ type: 'varchar', length: 255 })
  providerId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true, select: false })
  accessToken: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true, select: false })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
