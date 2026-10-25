import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Cada lectura de QR registrada.
 *
 * Es el historial detrás del contador de `client_goals.checks`: por cada fila
 * se ve quién, dónde y cuándo. La fila es inmutable (no se edita ni se borra),
 * así que no lleva `updatedAt`.
 */
@Entity('client_checks')
export class ClientCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` del cliente que leyó el QR. */
  @Index('idx_client_checks_client')
  @Column({ type: 'uuid' })
  clientId: string;

  /** `users.id` del comercio cuyo QR leyó. */
  @Index('idx_client_checks_merchant')
  @Column({ type: 'uuid' })
  merchantId: string;

  /** Meta contra la que sumó este check. */
  @Column({ type: 'uuid' })
  goalId: string;

  /** QR concreto que se consumió. Permite auditar una lectura puntual. */
  @Column({ type: 'uuid' })
  qrCodeId: string;

  @Index('idx_client_checks_created')
  @CreateDateColumn()
  createdAt: Date;
}
