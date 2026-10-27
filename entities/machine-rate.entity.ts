import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../transformers/numeric.transformer';

/**
 * Un escalón de la escalera de precios de una máquina: «3 horas valen tanto».
 *
 * El precio es del **bloque completo**, no por hora: por eso 4 horas no cuestan
 * cuatro veces una hora, sino un valor bastante menor. El cliente elige el
 * bloque y ese valor es el que se cobra.
 *
 * Cada equipo se identifica por `slug` y su escalera sale de multiplicar la
 * base (la de la lavadora de muebles) por su complejidad, redondeando a los mil
 * pesos. La escalera se guarda ya calculada para que la API no tenga que
 * repetir el redondeo en cada consulta.
 */
@Entity('machine_rates')
@Index('uq_machine_rates_machine_hours', ['machineId', 'horas'], {
  unique: true,
})
export class MachineRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `machines.id` del equipo al que pertenece el escalón. */
  @Index('idx_machine_rates_machine')
  @Column({ type: 'uuid' })
  machineId: string;

  /** Horas de uso que cubre el bloque (1, 2, 3 o 4). */
  @Column({ type: 'integer' })
  horas: number;

  /** Precio del bloque completo, en pesos colombianos. */
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  precio: number;

  @CreateDateColumn()
  createdAt: Date;
}
