import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  activationToken!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  resetPasswordToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles!: UserRole[];
}
