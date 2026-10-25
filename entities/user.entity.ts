import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  activationToken!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  resetPasswordToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string | null;

  /**
   * Aceptación de los términos y condiciones.
   *
   * `termsAcceptedAt` es la fecha del consentimiento y `termsVersion` la
   * versión del documento que la persona tenía a la vista cuando lo marcó.
   * Las dos juntas son la evidencia: una fecha sin versión no dice qué texto
   * se aceptó.
   *
   * Las cuentas creadas antes de estas columnas quedan en NULL, que es la
   * verdad: nunca se registró su aceptación.
   */
  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  termsVersion!: string | null;

  /**
   * Declaración de mayoría de edad hecha al registrarse.
   *
   * Comparte fecha con `termsAcceptedAt`: las dos casillas se marcan en el
   * mismo acto de registro, así que una sola fecha cubre las dos.
   */
  @Column({ type: 'boolean', nullable: true })
  isOfLegalAge!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles!: UserRole[];
}
