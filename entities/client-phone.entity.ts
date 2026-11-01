import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Teléfonos de un cliente.
 *
 * Un cliente puede dejar números distintos en cada compra (el celular, el de
 * la casa, el de la mamá…). Todos apuntan a la misma persona, y el número va
 * **normalizado** (solo dígitos, sin `+57`) para que `300 123 4567`,
 * `+57 3001234567` y `300-123-4567` sean el mismo.
 *
 * `phone` es único en toda la tabla: si llega un número ya registrado, la
 * compra se le suma a ese cliente en vez de crear otro.
 */
@Entity('client_phones')
export class ClientPhone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `clients.id` al que pertenece el número. */
  @Index('idx_client_phones_client')
  @Column({ type: 'uuid' })
  clientId: string;

  /** Número normalizado: solo dígitos, sin indicativo del país. */
  @Index('uq_client_phones_phone', { unique: true })
  @Column({ type: 'varchar', length: 30 })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;
}
