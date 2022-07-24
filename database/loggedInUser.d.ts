import { Snowflake } from './Utils';

export type LoggedInUserGuild = {
  id: Snowflake;
  icon: string;
  name: string;
  permissions: string;
};

export type LoggedInUserUser = {
  id: Snowflake;
  expires: number;
}

export type LoggedInUser = [
  LoggedInUserUser,
  LoggedInUserGuild[]
];
