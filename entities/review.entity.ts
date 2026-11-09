import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Una calificación que deja un cliente.
 *
 * Llega desde la **encuesta que se manda por correo** (API de notificaciones)
 * cuando termina un alquiler; la web solo las muestra. Por eso no hay pantalla
 * para calificar en el front.
 *
 * Las iniciales del avatar no se guardan: se sacan del nombre al pintarlas,
 * igual que en los comentarios de ejemplo.
 *
 * Se publican solas (`aprobada = true`). Si alguna se quiere quitar de la web,
 * se marca en `false` y deja de salir, sin borrar el registro.
 */
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nombre de quien califica, como lo escribe él mismo. */
  @Column({ type: 'varchar', length: 60 })
  nombre: string;

  /** Solo la ciudad, sin barrio ni dirección. */
  @Column({ type: 'varchar', length: 60, default: 'Bogotá' })
  ciudad: string;

  /** 1 a 5 estrellas. */
  @Column({ type: 'smallint' })
  estrellas: number;

  /** Lo que escribió el cliente. */
  @Column({ type: 'text' })
  comentario: string;

  /**
   * Pedido al que se refiere, si la encuesta venía de un correo.
   *
   * Es la `reference` del alquiler (`ALQ-…`). Sirve para saber de qué servicio
   * habla la opinión y para no calificar dos veces el mismo pedido.
   */
  @Index('idx_reviews_reference')
  @Column({ type: 'varchar', length: 50, nullable: true })
  rentalReference: string | null;

  /** `false` = no se muestra en la web. */
  @Column({ type: 'boolean', default: true })
  aprobada: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
