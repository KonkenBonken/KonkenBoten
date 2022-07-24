import { Snowflake } from './Utils';

export interface Temp {
  g: Snowflake;
  m: Snowflake;
  type: 'ban' | 'mute';
  until: number;
  role?: Snowflake;
  key?: string;
}
