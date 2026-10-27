import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer';

/**
 * Un turno del pedido: «esta máquina, este día, a esta hora, por estas horas».
 *
 * Es la pieza que ocupa la agenda. Un mismo pedido puede llevar dos turnos de
 * la misma máquina (por la mañana y por la tarde); en ese caso la hora de
 * traslado se pierde una sola vez, no dos (ver `RentalsService`).
 *
 * `fecha` es `date` (día del calendario, sin hora) para que no se corra un día
 * al convertir zonas horarias; `hora` es la hora de inicio en punto, en formato
 * 24 horas (7 = 7:00 a. m.). El fin del turno se calcula, no se guarda.
 *
 * El precio queda **copiado** (`amount`) porque la escalera del catálogo puede
 * cambiar y el pedido tiene que conservar lo que se cobró.
 */
@Entity('rental_items')
export class RentalItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `rentals.id` del pedido al que pertenece el turno. */
  @Index('idx_rental_items_rental')
  @Column({ type: 'uuid' })
  rentalId: string;

  /** `machines.slug` de la máquina reservada. */
  @Index('idx_rental_items_slug_fecha')
  @Column({ type: 'varchar', length: 60 })
  slug: string;

  /** Nombre de la máquina tal como se le mostró al cliente. */
  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  /** Horas de uso contratadas. */
  @Column({ type: 'integer' })
  horas: number;

  /** Día del turno, `YYYY-MM-DD`. */
  @Column({ type: 'date' })
  fecha: string;

  /** Hora de inicio en punto (7 a 18). */
  @Column({ type: 'integer' })
  hora: number;

  /** Precio del bloque, en pesos. */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
