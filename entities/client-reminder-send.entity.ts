import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Bitácora y cola de turnos del recordatorio de progreso a clientes.
 *
 * Cumple dos papeles:
 *
 * 1. **Bitácora**: a quién se le escribió, cuándo y, si falló, la razón.
 * 2. **Cola de turnos**: el envío automático atiende primero a quien hace más
 *    tiempo no recibe correo (los nunca escritos van de primeros). Como cada
 *    envío queda registrado aquí, al día siguiente esos clientes quedan solos
 *    al final de la fila: el tope diario rota y nadie se queda sin turno.
 *
 * Ojo con `sentAt`: **no** es `@CreateDateColumn` a propósito. El servidor de
 * base de datos corre en UTC, así que si lo llenara la base quedaría la hora
 * UTC (5 horas adelantada). Esta columna guarda la hora local de Bogotá, igual
 * que el resto de fechas del modelo, y la escribe siempre la aplicación.
 *
 * Un envío **fallido no cuenta** para la cola: no debe "quemar" el turno del
 * cliente. El índice que usa la cola (`IDX_client_reminder_sends_last_ok`,
 * sobre `clientId` + `sentAt DESC` y sólo con `success`, es decir un índice
 * parcial) vive en la migración: TypeORM no puede declararlo desde aquí.
 */
@Entity('client_reminder_sends')
export class ClientReminderSend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` del cliente al que se le escribió. */
  @Column({ type: 'uuid' })
  clientId: string;

  /** Correo al que se envió (queda copiado por si el usuario cambia después). */
  @Column({ type: 'varchar', length: 150 })
  email: string;

  /** Hora local de Bogotá en que salió el correo. */
  @Column({ type: 'timestamp' })
  sentAt: Date;

  /** `false` cuando el envío falló; el motivo queda en `reason`. */
  @Column({ type: 'boolean', default: true })
  success: boolean;

  /** Motivo del fallo cuando `success` es `false`. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  reason: string | null;

  /** Cuántas metas pendientes llevaba el correo. */
  @Column({ type: 'int', default: 0 })
  goalCount: number;
}
