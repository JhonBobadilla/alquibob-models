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
 * El **cobro** que se le crea a la pasarela para un pedido de alquiler.
 *
 * Es la primera de las tres tablas del flujo de pago (el mismo esquema que se
 * usó en la plataforma anterior, que ya estaba probado):
 *
 * 1. `rental_payment_intents` — el cobro: «cóbrenle esto a este cliente».
 * 2. `rental_payment_transactions` — cada intento y cada cambio de estado.
 * 3. `rental_payment_events` — el aviso crudo que manda la pasarela.
 *
 * Efipay permite **un intento por cobro**: si rechazan la tarjeta hay que crear
 * un cobro nuevo. Por eso aquí queda el cobro con su último estado, y el
 * historial completo vive en `rental_payment_transactions`.
 */
@Entity('rental_payment_intents')
export class RentalPaymentIntent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `rentals.id` del pedido. */
  @Index('idx_rental_payment_intents_rental')
  @Column({ type: 'uuid' })
  rentalId: string;

  /** Nuestra referencia (`alq-…`), la que viaja al checkout. */
  @Index('idx_rental_payment_intents_reference')
  @Column({ type: 'varchar', length: 50 })
  reference: string;

  /** `payment_id` de la pasarela. Se llena al generar el cobro. */
  @Index('uq_rental_payment_intents_efipay', { unique: true })
  @Column({ type: 'uuid', nullable: true })
  efipayPaymentId: string | null;

  /** Link del checkout. Se guarda entero y no se modifica. */
  @Column({ type: 'text', nullable: true })
  checkoutUrl: string | null;

  /** Total que se cobra. */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'COP' })
  currency: string;

  /** Último estado conocido del cobro: `pending`, `approved`, `rejected`… */
  @Index('idx_rental_payment_intents_status')
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Última clave de estado que mandó la pasarela. */
  @Column({ type: 'varchar', length: 30, nullable: true })
  efipayStatusKey: string | null;

  /** Cuándo se recibió el último aviso o consulta de este cobro. */
  @Column({ type: 'timestamp', nullable: true })
  lastStatusAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
