import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * Ajustes operativos del negocio (clave → valor).
 *
 * Es una tabla de configuración simple, compartida por las APIs: por ejemplo
 * `despachos_simultaneos` dice cuántos conductores/vehículos salen a la vez,
 * y con eso la agenda de la web deja (o no) dos entregas en la misma hora.
 *
 * Se guarda como texto para no migrar cada vez que aparece un ajuste nuevo;
 * cada módulo lo interpreta y lo valida.
 */
@Entity('app_settings')
export class AppSetting {
  /** Nombre del ajuste, ej. `despachos_simultaneos`. */
  @PrimaryColumn({ type: 'varchar', length: 60 })
  clave: string;

  /** Valor en texto, ej. `1`. */
  @Column({ type: 'varchar', length: 200 })
  valor: string;

  /** Descripción corta para quien lo edite desde el backoffice. */
  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
