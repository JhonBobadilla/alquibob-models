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
 * Un **cobro** (el `payment_id` de Efipay): «le vamos a cobrar esto a este
 * comercio».
 *
 * Es el primer paso de la pasarela. Efipay solo admite **un intento de pago
 * por cobro**: si el comercio paga y le rechazan la tarjeta, no se reintenta
 * sobre el mismo cobro, se genera uno nuevo. Por eso el histórico de intentos
 * vive en `payment_transactions` y aquí queda el cobro con su último estado.
 *
 * El estado del cobro se actualiza con el **webhook** (el mecanismo
 * principal). `lastCheckedAt` y `checkAttempts` son para el respaldo: preguntar
 * el estado a mano cuando el webhook no llegó.
 */
@Entity('payment_intents')
export class PaymentIntent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` del comercio al que se le cobra. */
  @Index('idx_payment_intents_merchant')
  @Column({ type: 'uuid' })
  merchantId: string;

  /** Suscripción (estado del plan) a la que pertenece este cobro. */
  @Column({ type: 'uuid', nullable: true })
  merchantSubscriptionId: string | null;

  /** Cobro en Efipay (`payment_id`). Se llena al generarlo allá. */
  @Index('uq_payment_intents_efipay_payment', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  efipayPaymentId: string | null;

  /** Nuestra referencia para conciliar (`sub-<id>`). Es única. */
  @Index('uq_payment_intents_reference', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  reference: string;

  /** Plan que se está pagando. */
  @Column({ type: 'varchar', length: 30 })
  planCode: string;

  /** Mes que cubre el pago, `YYYY-MM`, para saber qué período se pagó. */
  @Column({ type: 'varchar', length: 10, nullable: true })
  periodLabel: string | null;

  /** Qué se le cobra; el comercio lo ve en el checkout y en el comprobante. */
  @Column({ type: 'varchar', length: 191 })
  description: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'COP' })
  currency: string;

  /** Sucursal de Efipay que emite el cobro. */
  @Column({ type: 'integer', nullable: true })
  office: number | null;

  /** `redirect` (los dos primeros pasos son nuestros) o `api`. */
  @Column({ type: 'varchar', length: 20, default: 'redirect' })
  checkoutType: string;

  /** Link firmado del checkout. Se guarda entero y no se modifica. */
  @Column({ type: 'text', nullable: true })
  checkoutUrl: string | null;

  /**
   * `pending` | `approved` | `rejected` | `failed` | `expired` | `voided` |
   * `refunded`. Ojo: `pending` es «nadie ha pagado todavía», no un rechazo.
   */
  @Index('idx_payment_intents_status')
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Estado crudo de Efipay (`Aprobada`), por si agregan valores nuevos. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  efipayStatus: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  efipayStatusKey: string | null;

  /** Cuántos intentos de pago tiene el cobro. */
  @Column({ type: 'integer', default: 0 })
  transactionCount: number;

  /** Datos del pagador, tal como los devuelve Efipay. */
  @Column({ type: 'varchar', length: 150, nullable: true })
  payerName: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  payerEmail: string | null;

  /** Hasta cuándo se puede pagar (`limit_date`). */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  /** Cuándo cambió el estado por última vez. */
  @Column({ type: 'timestamp', nullable: true })
  lastStatusAt: Date | null;

  /** Última vez que le preguntamos el estado a Efipay (respaldo del webhook). */
  @Column({ type: 'timestamp', nullable: true })
  lastCheckedAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  checkAttempts: number;

  /** Si no se pudo crear el cobro en Efipay, aquí queda el motivo. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  /** Quién generó el cobro: el comercio desde la app o un admin del BO. */
  @Column({ type: 'uuid', nullable: true })
  createdByUserId: string | null;

  /** Lo que le enviamos a Efipay en `payment.metadata`. */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
