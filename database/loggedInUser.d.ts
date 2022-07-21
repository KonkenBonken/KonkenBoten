import { Snowflake } from './Utils';

export type LoggedInUser = [
  {
    id: Snowflake, expires: number
  },
  {
    id: Snowflake,
    icon: string,
    name: string,
    permissions: string
  }[]
];
