import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OtpChannel } from '../enums/otp-channel.enum';

@Entity('otp_tokens')
export class OtpToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  identifier: string;

  @Column({ type: 'enum', enum: OtpChannel })
  channel: OtpChannel;

  @Column({ type: 'varchar', length: 255, select: false })
  codeHash: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date | null;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
