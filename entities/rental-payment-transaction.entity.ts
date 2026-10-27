import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer';

/**
 * Un **intento** de pago y cada cambio de estado que reporta la pasarela.
 *
 * Es la tabla de historial: **nunca se actualiza, sólo se agrega**. Así se
 * puede reconstruir la vida de un cobro: se creó, quedó pendiente, lo
 * rechazaron con tal código, se consultó de nuevo, lo aprobaron…
 *
 * De aquí sale el respaldo de la compra: método de pago, franquicia, tarjeta
 * **enmascarada**, cuotas, código de autorización, código de respuesta y el
 * motivo del rechazo. Nunca se guardan datos sensibles: el número completo de
 * la tarjeta no llega, y lo que llega enmascarado se guarda enmascarado.
 */
@Entity('rental_payment_transactions')
export class RentalPaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `rental_payment_intents.id` del cobro al que pertenece. */
  @Index('idx_rental_payment_transactions_intent')
  @Column({ type: 'uuid' })
  intentId: string;

  /** Qué lo trajo: el aviso de la pasarela o nuestra consulta de estado. */
  @Column({ type: 'varchar', length: 10, default: 'webhook' })
  source: string;

  /** `event_id` del aviso, cuando viene por webhook. */
  @Index('idx_rental_payment_transactions_event')
  @Column({ type: 'varchar', length: 80, nullable: true })
  efipayEventId: string | null;

  /** Consecutivo de la transacción en la pasarela. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  efipayTransactionId: string | null;

  /** Estado normalizado: `approved`, `rejected`, `pending`… */
  @Index('idx_rental_payment_transactions_status')
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /** Estado tal cual lo manda la pasarela. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  statusKey: string | null;

  /** Código de respuesta de la franquicia. */
  @Column({ type: 'varchar', length: 10, nullable: true })
  responseCode: string | null;

  /** Por qué se rechazó. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  paymentMethodSource: string | null;

  /** Tarjeta enmascarada (`**** **** **** 1234`). */
  @Column({ type: 'varchar', length: 30, nullable: true })
  cardMasked: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  franchise: string | null;

  @Column({ type: 'integer', nullable: true })
  installments: number | null;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  amount: number | null;

  @Column({ type: 'varchar', length: 3, nullable: true })
  currency: string | null;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  valueCop: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  authorizationCode: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  trazabilityId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  providerCreatedAt: Date | null;

  /** El bloque `transaction` del aviso, ya limpio. */
  @Column({ type: 'jsonb', nullable: true })
  raw: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;
}
