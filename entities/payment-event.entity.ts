import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Bitácora de los **webhooks** que nos manda Efipay.
 *
 * Cumple dos papeles que la documentación de Efipay pide a gritos:
 *
 * 1. **Idempotencia**: reintentan hasta 7 veces el mismo evento (hasta ~17
 *    horas), así que `efipayEventId` es único y, si el evento ya está, se
 *    responde `2xx` sin volver a procesarlo.
 * 2. **Auditoría**: el cuerpo tal como llegó, si la firma cuadró y qué pasó al
 *    procesarlo. Sin esto, un pago «que no se ve» no tiene por dónde
 *    rastrearse.
 *
 * La firma se verifica **antes** de guardar y contra el cuerpo crudo
 * (`Signature` = HMAC-SHA256 del body sin parsear, con el token de webhooks).
 */
@Entity('payment_events')
export class PaymentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `meta.event_id` de Efipay. Único: es la llave para no repetir procesos. */
  @Index('uq_payment_events_efipay_event', { unique: true })
  @Column({ type: 'uuid' })
  efipayEventId: string;

  /** `meta.event_type` (ej. `transaction.status_changed`). */
  @Column({ type: 'varchar', length: 80, nullable: true })
  eventType: string | null;

  /** Cobro reconocido a partir del cuerpo del webhook, si se pudo. */
  @Index('idx_payment_events_intent')
  @Column({ type: 'uuid', nullable: true })
  paymentIntentId: string | null;

  @Column({ type: 'uuid', nullable: true })
  paymentTransactionId: string | null;

  /** `false` = la firma no cuadró: se guarda para auditoría y no se procesa. */
  @Column({ type: 'boolean', default: false })
  signatureValid: boolean;

  /** Cuerpo del webhook tal como llegó. */
  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  /** Cuántas veces ha llegado este mismo evento (reintentos de Efipay). */
  @Column({ type: 'integer', default: 1 })
  deliveries: number;

  /**
   * `received` (recién llegado) | `processed` | `failed` | `skipped` (firma
   * inválida).
   */
  @Column({ type: 'varchar', length: 20, default: 'received' })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  /** Cuándo lo recibimos, en hora local de Bogotá. */
  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;
}
