import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Meta de un comercio: "junta N checks y llévate tal premio".
 *
 * Es **inmutable** a propósito. Una meta se crea y no se toca: si el comercio
 * quiere otras condiciones, crea una meta nueva. Los clientes que ya estaban
 * participando siguen con la suya (queda grabada en `client_goals.goalId`) y
 * la nueva rige sólo para los que lleguen después.
 *
 * La meta "vigente" es la creada más recientemente que no esté borrada ni
 * vencida. No hay columna de estado porque no se puede activar ni desactivar.
 */
@Entity('merchant_goals')
export class MerchantGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` de la cuenta COMERCIO dueña de la meta. */
  @Index('idx_merchant_goals_merchant')
  @Column({ type: 'uuid' })
  merchantId: string;

  /** Nombre de la promoción, ej. "Café gratis". */
  @Column({ type: 'varchar', length: 120 })
  name: string;

  /** Detalle opcional de la promoción. */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  /** Checks que el cliente debe juntar para ganarla. */
  @Column({ type: 'int' })
  checksRequired: number;

  /** Qué se lleva el cliente al completarla. */
  @Column({ type: 'varchar', length: 255 })
  reward: string;

  /** Fin opcional de la promoción. `null` = no vence. */
  @Column({ type: 'timestamp', nullable: true })
  endsAt: Date | null;

  /**
   * Borrado lógico: la meta no se borra físicamente porque hay historial de
   * clientes que apunta a ella. Sólo se permite borrar si no tiene
   * participantes, o si ya pasó más de un año desde que se creó.
   */
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
