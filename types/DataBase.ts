import fs from 'fs';
import { Snowflake } from './Utils';

import { Guild } from './guild';
import { Temp } from './temp';
import { LoggedInUser } from './loggedInUser';

interface DataBaseData {
  guilds: Record<Snowflake, Guild>;
  temp: Record<string, Temp>;
  loggedIn: Record<Snowflake, LoggedInUser>;
  voiceCreated: Snowflake[];
}

class DataBase implements DataBaseData {
  guilds: Record<Snowflake, Guild>;
  temp: Record<string, Temp>;
  loggedIn: Record<Snowflake, LoggedInUser>;
  voiceCreated: Snowflake[];

  constructor(data: DataBaseData) {
    this.guilds = data.guilds;
    this.temp = data.temp;
    this.loggedIn = data.loggedIn;
    this.voiceCreated = data.voiceCreated;
  }
}

const raw = JSON.parse(
  fs.readFileSync('DataBase.json', 'utf8')
    .trim()
    .replace(/Ã¤/g, 'ä').replace(/Ã¥/g, 'å').replace(/Ã¶/g, 'ö')
) as DataBaseData;
export default new DataBase(raw);
