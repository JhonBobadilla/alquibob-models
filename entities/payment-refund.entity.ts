import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer';

/**
 * Devoluciones y anulaciones de un pago ya hecho.
 *
 * Se guarda aparte de la transacción porque es un hecho nuevo (y con su
 * propio resultado): la transacción original queda intacta, que es lo que
 * sirve para conciliar.
 */
@Entity('payment_refunds')
export class PaymentRefund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Cobro devuelto (`payment_intents.id`). */
  @Index('idx_payment_refunds_intent')
  @Column({ type: 'uuid' })
  paymentIntentId: string;

  /** Transacción que se devuelve, si se conoce. */
  @Column({ type: 'uuid', nullable: true })
  paymentTransactionId: string | null;

  /** Id de la devolución en Efipay, si la responde. */
  @Column({ type: 'uuid', nullable: true })
  efipayRefundId: string | null;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  /** Motivo, para el comprobante y para soporte. */
  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string | null;

  /** `requested` | `approved` | `rejected`. */
  @Column({ type: 'varchar', length: 20, default: 'requested' })
  status: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  errorCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  errorMessage: string | null;

  /** Quién la pidió desde el backoffice. */
  @Column({ type: 'uuid', nullable: true })
  requestedByUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  /** Cuándo quedó resuelta (aprobada o rechazada), hora de Bogotá. */
  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;
}
