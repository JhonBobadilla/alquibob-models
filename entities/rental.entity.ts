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
 * Un pedido de alquiler: una o varias máquinas, cada una con su turno.
 *
 * El pedido nace **antes** de cobrar (`pending`) porque el turno tiene que
 * quedar tomado mientras el cliente paga en la pasarela; si nadie paga, el
 * alquiler se cae y la máquina se libera. El que confirma es el **webhook**,
 * nunca el navegador: volver del checkout no prueba que el pago exista.
 *
 * Los datos de entrega se guardan copiados aquí (no como referencia al
 * usuario) porque en este negocio el cliente compra sin crear cuenta.
 */
@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nuestra referencia para conciliar el pago (`alq-<uuid corto>`). Única. */
  @Index('uq_rentals_reference', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  reference: string;

  /**
   * `pending` | `paid` | `failed` | `expired` | `cancelled`.
   * Ver `RentalStatus`.
   */
  @Index('idx_rentals_status')
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Qué se le cobra; el cliente lo ve en el checkout y en el correo. */
  @Column({ type: 'varchar', length: 191 })
  description: string;

  /** Total del pedido. Lo calcula el servidor, no el navegador. */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'COP' })
  currency: string;

  /** Cobro en la pasarela. Se llena cuando Efipay lo crea. */
  @Index('uq_rentals_efipay_payment', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  efipayPaymentId: string | null;

  /** Link firmado del checkout. Se guarda entero y no se modifica. */
  @Column({ type: 'text', nullable: true })
  checkoutUrl: string | null;

  /** A quién se le entrega: nombre y apellido juntos. */
  @Column({ type: 'varchar', length: 150 })
  customerName: string;

  @Column({ type: 'varchar', length: 30 })
  customerPhone: string;

  @Column({ type: 'varchar', length: 150 })
  customerEmail: string;

  @Column({ type: 'varchar', length: 80 })
  customerCity: string;

  @Column({ type: 'varchar', length: 80 })
  customerLocality: string;

  @Column({ type: 'varchar', length: 191 })
  customerAddress: string;

  /** Cuándo se confirmó el pago. */
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  /** Hasta cuándo se le guarda el turno mientras paga. */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  /** Motivo de un cobro fallido (lo que respondió la pasarela). */
  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  /** Lo que quiera guardar el flujo de cobro (respuesta cruda, etc.). */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
