import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Cliente del negocio (tabla maestra).
 *
 * En Alquibob se compra **sin crear cuenta**, así que el cliente se arma con
 * los datos que deja al reservar. Antes se derivaba agrupando `rentals` por
 * teléfono; eso duplicaba a la misma persona cuando escribía otro número.
 *
 * Ahora hay una fila por persona:
 *   · `client_phones` guarda todos sus teléfonos normalizados (uno por fila,
 *     único en la tabla) → el teléfono es la llave de identidad.
 *   · `email` también sirve para reconocerlo cuando cambia de número.
 *   · `rentals.clientId` apunta al cliente; el alquiler conserva su copia de
 *     los datos (lo que se cobró y a quién) para no perder el histórico.
 */
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre tal como lo escribió la última vez. */
  @Index('idx_clients_name')
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /** Correo normalizado (minúsculas y sin espacios); `null` si no dejó. */
  @Index('idx_clients_email')
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  locality: string | null;

  @Column({ type: 'varchar', length: 191, nullable: true })
  address: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
