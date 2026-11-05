import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * Conductores disponibles en una fecha concreta.
 *
 * Manda sobre el ajuste global: si el día tiene fila, ese es el número de
 * entregas que pueden solaparse; si no, se usa `app_settings`.
 *
 * `conductores = 0` significa **día cerrado**: la web no ofrece horarios.
 */
@Entity('driver_days')
export class DriverDay {
  /** Día de la agenda (`YYYY-MM-DD`). */
  @PrimaryColumn({ type: 'date' })
  fecha: string;

  /** Cuántas entregas pueden salir a la vez ese día. */
  @Column({ type: 'int' })
  conductores: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
