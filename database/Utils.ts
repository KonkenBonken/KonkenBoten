export { Snowflake } from 'discord.js';

export type EncodedT = number;

export function mapValues<K, V, R>(obj: Record<K, V>, mapper: (V) => R): Record<K, R> {
  for (const key in obj)
    obj[key] = mapper(obj[key]);
  return obj
}

export function mapToClass<C, K, V>(goalClass: C, obj: Record<K, V>) {
  return mapValues(obj, (x: V) => new goalClass(x))
}
