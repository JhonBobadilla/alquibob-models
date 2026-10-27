import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Un **aviso** de la pasarela, guardado tal como llegó (ya limpio).
 *
 * Es el respaldo y la bitácora: si mañana hay que responder «¿qué mandó Efipay
 * de este pedido?», está aquí, con el bloque `checkout` completo, la transacción
 * y la firma. Sirve además para no procesar dos veces el mismo aviso
 * (`efipayEventId` es único: la pasarela reintenta hasta 7 veces).
 */
@Entity('rental_payment_events')
export class RentalPaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `meta.event_id` del aviso. Único: es la llave de idempotencia. */
  @Index('uq_rental_payment_events_event', { unique: true })
  @Column({ type: 'varchar', length: 80 })
  efipayEventId: string;

  /** `meta.event_type` (`transaction.status_changed`…). */
  @Column({ type: 'varchar', length: 60, nullable: true })
  eventType: string | null;

  /** Pedido al que se pudo asociar (null si no se reconoció). */
  @Index('idx_rental_payment_events_rental')
  @Column({ type: 'uuid', nullable: true })
  rentalId: string | null;

  /** Cobro al que se pudo asociar. */
  @Column({ type: 'uuid', nullable: true })
  intentId: string | null;

  /** Si la firma HMAC cuadró. Un aviso sin firma se guarda y no se procesa. */
  @Column({ type: 'boolean', default: false })
  signatureValid: boolean;

  /** `received` | `processed` | `skipped` | `failed`. */
  @Column({ type: 'varchar', length: 20, default: 'received' })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  /** Cuerpo del aviso, ya sin datos sensibles. */
  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  /** Hora de Bogotá en que lo recibimos. */
  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
