import { LoggedInUser } from '../../../../database/loggedInUser.d.ts';

export interface ContextData {
  user?: {
    id: string,
    avatar: string,
    username: string,
    discriminator: string,
    guilds?: LoggedInUser[1]
  }
}
