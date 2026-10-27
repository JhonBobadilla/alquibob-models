/**
 * En qué va un alquiler de máquinas.
 *
 * Sólo `pending` y `paid` **ocupan la agenda**: mientras el cobro no se haya
 * resuelto el turno está tomado, para que dos clientes no paguen la misma hora.
 * Cuando el alquiler se cae (`failed`, `expired`, `cancelled`) la máquina se
 * libera sola, sin que nadie tenga que borrar nada.
 */
export enum RentalStatus {
  /** Se armó el cobro y se generó el link de pago; nadie ha pagado. */
  PENDING = 'pending',

  /** Pagado (lo confirma el webhook de la pasarela). */
  PAID = 'paid',

  /** El cobro falló (rechazo o error de la pasarela): el turno se libera. */
  FAILED = 'failed',

  /** Nadie pagó dentro del plazo: el turno se libera. */
  EXPIRED = 'expired',

  /** Lo anuló el cliente o el negocio: el turno se libera. */
  CANCELLED = 'cancelled',
}
