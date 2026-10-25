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
 * Cada **intento de pago** de un cobro, con su resultado.
 *
 * Aquí es donde queda el detalle que el comercio necesita cuando le rechazan
 * la tarjeta: el código de respuesta, la causal (`errorCode`), si tiene
 * sentido reintentar (`errorRetryable`) y qué debería hacer
 * (`errorAction` = `contact_issuer`, `use_another_card`, `check_card_data`…).
 *
 * Efipay identifica una transacción de dos formas y guardamos las dos: el
 * consecutivo (`efipayTransactionId`, el número que ve un operador) y el UUID.
 *
 * Nota: en Postgres los `numeric` llegan como texto y los `bigint` también
 * (para no perder precisión), por eso el consecutivo se maneja como cadena.
 */
@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Cobro al que pertenece (`payment_intents.id`). */
  @Index('idx_payment_transactions_intent')
  @Column({ type: 'uuid' })
  paymentIntentId: string;

  /** Consecutivo de Efipay, el número que se le muestra a una persona. */
  @Index('uq_payment_transactions_efipay_number', { unique: true })
  @Column({ type: 'bigint', nullable: true })
  efipayTransactionId: string | null;

  /** UUID de la transacción en Efipay. */
  @Index('uq_payment_transactions_efipay_uuid', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  efipayTransactionUuid: string | null;

  /** `approved` | `rejected` | `pending` | `failed` | `voided` | `refunded`. */
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /** Clave estable de Efipay (`approved`, `rejected`, …). */
  @Column({ type: 'varchar', length: 30, nullable: true })
  statusKey: string | null;

  /** Texto crudo de Efipay («Aprobada», «Rechazada»). */
  @Column({ type: 'varchar', length: 30, nullable: true })
  efipayStatus: string | null;

  /** Código de respuesta de la red («00», «05», «51», «98»…). */
  @Column({ type: 'varchar', length: 10, nullable: true })
  responseCode: string | null;

  /** Detalle del rechazo. */
  @Column({ type: 'varchar', length: 10, nullable: true })
  errorCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  errorMessage: string | null;

  /** `false` = no tiene sentido reintentar (fondos, tarjeta vencida, fraude). */
  @Column({ type: 'boolean', nullable: true })
  errorRetryable: boolean | null;

  /** Qué se le sugiere al pagador: `contact_issuer`, `use_another_card`… */
  @Column({ type: 'varchar', length: 40, nullable: true })
  errorAction: string | null;

  /** Mensaje para el tarjetahabiente, tal como lo manda Efipay. */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  /** `credit` | `debit` | `pse` | `cash`… */
  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: string | null;

  /** Franquicia o banco («Visa», «Mastercard», «PSE») */
  @Column({ type: 'varchar', length: 40, nullable: true })
  paymentMethodSource: string | null;

  /** Tarjeta enmascarada por Efipay: `52**********0339`. Nunca el número. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  cardMasked: string | null;

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

  /** Equivalente en pesos (lo que de verdad se movió si la moneda no es COP). */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  valueCop: number | null;

  /** Código de autorización del banco. Sirve para reclamar. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  authorizationCode: string | null;

  /** Id de trazabilidad de la red. */
  @Column({ type: 'varchar', length: 50, nullable: true })
  trazabilityId: string | null;

  /** Cuándo se aprobó, en hora local de Bogotá. */
  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  /** `created_at` que reporta Efipay, convertido a hora de Bogotá. */
  @Column({ type: 'timestamp', nullable: true })
  providerCreatedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
