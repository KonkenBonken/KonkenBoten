import { promises as fs } from 'fs';
import { Snowflake, mapToClass } from './Utils';

import { Guild } from './guild';
import { Temp } from './temp';
import { LoggedInUser } from './loggedInUser';

class DataBase {
  guilds: Record<Snowflake, Guild>;
  temp: Record<string, Temp>;
  loggedIn: Record<Snowflake, LoggedInUser>;
  voiceCreated: Snowflake[];

  constructor(data: object) {
    this.guilds = data.guilds;
    this.temp = data.temp;
    this.loggedIn = data.loggedIn;
    this.voiceCreated = data.voiceCreated;
  }
}

const raw = JSON.parse(
  await fs.readFile('DataBase.json', 'utf8')
    .trim()
    .replace(/Ã¤/g, 'ä').replace(/Ã¥/g, 'å').replace(/Ã¶/g, 'ö')
)
export default new DataBase(raw);
