import { Guild } from './guild';
import { LoggedInUserGuild } from './loggedInUser';
import { Snowflake } from './Utils';

export interface ContextData {
  user?: {
    id: Snowflake
    avatar: string
    username: string
    discriminator: string
    guilds?: LoggedInUserGuild[]
  }
  guild?: {
    id: Snowflake
    member: {
      nickname: string
      color: string
    }
    database: Guild
    discord: {
      categories: {
        id: Snowflake
        name: string
        position?: number
      }[]
      channels: {
        id: Snowflake
        name: string
        position?: number
        type?: string
        parent?: Snowflake
        permissions?: string
      }[]
      members: {
        id: Snowflake
        name: string
        tag: string
        avatar?: string
        color?: string
        permissions: string
      }[]
      roles: {
        id: Snowflake
        name: string
        position?: number
        color?: string
        permissions: string
      }[]
    }
  }
}