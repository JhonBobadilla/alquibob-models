import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * QR de un comercio, **de un solo uso**.
 *
 * Cada lectura consume el token y genera otro. Sirve para que nadie sume
 * checks reutilizando la misma foto del código del mostrador.
 *
 * El QR es del comercio, no de una meta: sirve para cualquiera, y quien lo lee
 * entra a la meta vigente en ese momento. Por eso no guarda `goalId`.
 */
@Entity('merchant_qr_codes')
export class MerchantQrCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** `users.id` de la cuenta COMERCIO dueña del código. */
  @Index('idx_merchant_qr_merchant')
  @Column({ type: 'uuid' })
  merchantId: string;

  /** Lo que va dentro del QR. Único en toda la tabla. */
  @Index('idx_merchant_qr_token', { unique: true })
  @Column({ type: 'varchar', length: 64 })
  token: string;

  /** `true` cuando alguien lo leyó. Un QR usado no se puede volver a usar. */
  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date | null;

  /** Cliente que lo leyó, para poder auditar los checks. */
  @Column({ type: 'uuid', nullable: true })
  usedByUserId: string | null;

  /**
   * Anulado por el comercio con "Generar nuevo QR": ya no sirve, pero nadie lo
   * leyó (a diferencia de `isUsed`, que significa que sí se usó).
   */
  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
