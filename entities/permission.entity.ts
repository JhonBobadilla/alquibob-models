import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { Resource } from './resource.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
@Unique(['resourceId', 'action'])
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Resource, (resource) => resource.permissions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resourceId' })
  resource!: Resource;

  @Column()
  resourceId!: number;

  @Column({ type: 'varchar', length: 50 })
  @Index()
  action!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'json', nullable: true })
  conditions!: Record<string, any> | null;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status!: Status;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get slug(): string {
    return `${this.resource.slug}:${this.action}`;
  }
}
