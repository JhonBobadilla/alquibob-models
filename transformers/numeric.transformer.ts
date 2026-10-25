import { ValueTransformer } from 'typeorm';

/**
 * Transformador para las columnas `numeric` de Postgres.
 *
 * El driver devuelve los `numeric` como **texto** (para no perder precisión) y
 * TypeORM los deja tal cual, así que sin esto los montos llegarían como
 * `"20000.00"`. Con el transformador quedan como número en los servicios, que
 * es como se usan siempre.
 */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | number | null) =>
    value === null || value === undefined ? null : Number(value),
};
