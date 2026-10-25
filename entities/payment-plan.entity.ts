import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer';

/**
 * Catálogo de planes del programa.
 *
 * Los topes y el precio viven **aquí y no en el código**: cambiar cuántos
 * clientes incluye un plan o cuánto vale la mensualidad es un `UPDATE`, no un
 * despliegue.
 *
 * Los tres planes del negocio:
 *
 * - `free` — hasta 5 clientes. Es el que tienen todas las cuentas al nacer.
 * - `basico` — hasta 150 clientes. Se activa cuando el pago se confirma.
 * - `personalizado` — sin tope (`clientLimit` nulo), se asigna a mano.
 *
 * Un plan se **desactiva** (`active = false`) cuando se retira del mercado,
 * pero las suscripciones que ya lo usan siguen funcionando.
 */
@Entity('payment_plans')
export class PaymentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Código estable: es el que usa el código (`free`, `basico`, …). */
  @Index('uq_payment_plans_code', { unique: true })
  @Column({ type: 'varchar', length: 30 })
  code: string;

  /** Nombre para mostrar, ej. "Plan básico". */
  @Column({ type: 'varchar', length: 80 })
  name: string;

  /**
   * Clientes distintos que permite el plan. `null` = sin tope (así está el
   * personalizado, que se negocia caso por caso).
   */
  @Column({ type: 'integer', nullable: true })
  clientLimit: number | null;

  /** Mensualidad. `0` en el plan gratis. */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  priceAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'COP' })
  currency: string;

  /** Días que cubre cada pago (la mensualidad). */
  @Column({ type: 'integer', default: 30 })
  billingDays: number;

  /** Días de gracia que tiene el comercio antes de bloquearse. */
  @Column({ type: 'integer', default: 5 })
  graceDays: number;

  /** `false` = plan retirado: no se ofrece, pero no rompe a quien lo tenga. */
  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
