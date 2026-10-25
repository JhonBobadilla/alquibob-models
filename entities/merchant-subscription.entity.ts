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
 * Estado del plan de un comercio. **Una fila por comercio** (`merchantId`
 * único): no es un histórico de planes, es «en qué va hoy».
 *
 * Es la tabla que manda en la regla de negocio:
 *
 * - Todos arrancan en `free` (hasta 5 clientes).
 * - Cuando se pasa del tope del plan se queda en `past_due` con `graceEndsAt`
 *   a 5 días: ve el aviso y el botón de pago. Si se vence el plazo y no paga,
 *   pasa a `blocked`.
 * - Cuando el pago se confirma (webhook) pasa a `active`, con el tope del plan
 *   nuevo y `periodEnd` a `billingDays` días.
 * - `blocked` = no se le genera QR nuevo hasta que pague. Nada más se borra:
 *   al pagar todo vuelve como estaba.
 * - `custom` (plan personalizado, más de 150 clientes) lo asigna un
 *   administrador a mano y no lo toca el automatismo.
 *
 * Las fechas de negocio (`periodStart`, `periodEnd`, `nextChargeAt`,
 * `graceEndsAt`) las escribe el API en **hora local de Bogotá**, no con
 * `now()`: el servidor corre en UTC y quedarían 5 horas adelantadas.
 */
@Entity('merchant_subscriptions')
export class MerchantSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` de la cuenta COMERCIO. */
  @Index('uq_merchant_subscriptions_merchant', { unique: true })
  @Column({ type: 'uuid' })
  merchantId: string;

  /** Plan vigente (`payment_plans.code`). */
  @Column({ type: 'varchar', length: 30, default: 'free' })
  planCode: string;

  /**
   * `free` | `past_due` (en gracia, ve avisos) | `active` (pagó) |
   * `blocked` (sin QR hasta que pague) | `custom` (personalizado).
   */
  @Index('idx_merchant_subscriptions_status')
  @Column({ type: 'varchar', length: 20, default: 'free' })
  status: string;

  /** Tope del plan vigente, copiado al activarlo. `null` = sin tope. */
  @Column({ type: 'integer', nullable: true })
  clientLimit: number | null;

  /** Mensualidad que le corresponde a este comercio. */
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

  /** Último conteo de clientes distintos del comercio. */
  @Column({ type: 'integer', default: 0 })
  clientCount: number;

  /** Inicio y fin del período ya pagado. */
  @Column({ type: 'timestamp', nullable: true })
  periodStart: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  periodEnd: Date | null;

  /** Cuándo toca volver a pagar (es la fecha del correo de recordatorio). */
  @Column({ type: 'timestamp', nullable: true })
  nextChargeAt: Date | null;

  /** Hasta cuándo tiene gracia antes de bloquearse. */
  @Column({ type: 'timestamp', nullable: true })
  graceEndsAt: Date | null;

  /** Cuándo se pasó del tope del plan (arranca la cuenta de los 5 días). */
  @Column({ type: 'timestamp', nullable: true })
  exceededAt: Date | null;

  /** Último cobro generado para este comercio. */
  @Column({ type: 'uuid', nullable: true })
  lastPaymentIntentId: string | null;

  /** Último pago confirmado. */
  @Column({ type: 'timestamp', nullable: true })
  lastPaidAt: Date | null;

  /** Control de los correos de aviso, para no repetirlos. */
  @Column({ type: 'timestamp', nullable: true })
  lastReminderAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  reminderCount: number;

  @Column({ type: 'timestamp', nullable: true })
  blockedAt: Date | null;

  /** Por qué quedó bloqueado o en gracia (texto para mostrar/soportar). */
  @Column({ type: 'varchar', length: 255, nullable: true })
  blockReason: string | null;

  /** Administrador del backoffice que cambió el plan a mano, si aplica. */
  @Column({ type: 'uuid', nullable: true })
  planChangedByUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
