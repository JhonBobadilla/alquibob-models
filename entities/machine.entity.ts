import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Una máquina del catálogo de alquiler.
 *
 * El precio no vive aquí: cada equipo tiene su **escalera** de bloques de horas
 * en `machine_rates` (1, 2, 3 y 4 horas). Separarlo permite cambiar un precio
 * sin tocar la ficha del equipo y deja la escalera ordenada por horas.
 *
 * Las que todavía no están confirmadas se guardan igual pero con
 * `pendiente = true` y sin escalera: el catálogo las muestra como "Pronto" y
 * no se pueden reservar.
 */
@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Identificador legible que va en la URL y en los enlaces de reserva
   * (`lavadora-muebles`). Es la llave con la que el front pide la agenda.
   */
  @Index('uq_machines_slug', { unique: true })
  @Column({ type: 'varchar', length: 60 })
  slug: string;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  /** Agrupación del catálogo: Limpieza, Jardín, Herramientas. */
  @Column({ type: 'varchar', length: 40 })
  categoria: string;

  /** Qué hace y para qué sirve. */
  @Column({ type: 'text' })
  descripcion: string;

  /** Foto del equipo. `null` = todavía no hay foto. */
  @Column({ type: 'varchar', length: 160, nullable: true })
  imagen: string | null;

  /**
   * Punto de la foto que se ve en el recorte (`object-position`, ej. `76% 52%`).
   * Las fotos son de ambiente: sin esto se ve la sala y no la máquina.
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  foco: string | null;

  /** Se puede alquilar hoy. */
  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  /** `true` mientras el equipo no está confirmado: se muestra como "Pronto". */
  @Column({ type: 'boolean', default: false })
  pendiente: boolean;

  /** Orden en que se pinta en el catálogo. */
  @Column({ type: 'integer', default: 0 })
  orden: number;

  @CreateDateColumn()
  createdAt: Date;
}
