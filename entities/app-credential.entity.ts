import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('app_credentials')
export class AppCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 36, unique: true })
  clientId: string;

  @Column({ type: 'varchar', length: 255, select: false })
  clientSecretHash: string;

  @Column({ type: 'simple-json', nullable: true })
  permissions: string[] | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  createdBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
