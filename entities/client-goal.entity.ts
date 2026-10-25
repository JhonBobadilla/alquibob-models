import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Inscripción de un cliente a la meta de un comercio.
 *
 * Un cliente tiene **una sola inscripción por comercio** (`clientId` +
 * `merchantId` son únicos): la meta con la que entró es la que sigue para
 * siempre, aunque el comercio publique metas nuevas después.
 *
 * Aquí vive el progreso que la app va "chuleando" en cada lectura de QR.
 */
@Entity('client_goals')
@Index('uq_client_goals_client_merchant', ['clientId', 'merchantId'], {
  unique: true,
})
export class ClientGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` del cliente que se inscribió. */
  @Index('idx_client_goals_client')
  @Column({ type: 'uuid' })
  clientId: string;

  /** `users.id` del comercio donde se inscribió. */
  @Index('idx_client_goals_merchant')
  @Column({ type: 'uuid' })
  merchantId: string;

  /**
   * Meta con la que entró. Se queda fija aunque el comercio cree metas nuevas,
   * que es justamente la regla del negocio.
   */
  @Index('idx_client_goals_goal')
  @Column({ type: 'uuid' })
  goalId: string;

  /** Checks acumulados en esta inscripción. */
  @Column({ type: 'int', default: 0 })
  checks: number;

  /** Cuándo se completó la meta. `null` mientras siga en curso. */
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
