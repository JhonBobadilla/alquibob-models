import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Registro de correos automáticos ya enviados.
 *
 * Existe para que un correo **no se repita nunca**: cada caso tiene su `tipo`
 * y su `referencia`, y hay un índice único sobre la pareja. Si el cron corre
 * dos veces (o se reinicia el servidor), el segundo intento se descarta.
 *
 * Tipos:
 * - `pago_confirmado` → referencia del pedido
 * - `recordatorio_24h` / `recordatorio_12h` → referencia del pedido
 * - `review` → referencia del pedido
 * - `winback_15d` → correo + fecha del último alquiler (así el cliente puede
 *   volver a recibirlo en otro ciclo)
 */
@Entity('notification_log')
@Index('uq_notification_log_tipo_referencia', ['tipo', 'referencia'], {
  unique: true,
})
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 40 })
  tipo: string;

  @Column({ type: 'varchar', length: 160 })
  referencia: string;

  /** A quién se le envió (para poder rastrear rebotes). */
  @Column({ type: 'varchar', length: 160, nullable: true })
  email: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  sentAt: Date;
}
