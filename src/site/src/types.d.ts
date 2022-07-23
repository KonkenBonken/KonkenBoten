import { LoggedInUser } from '../../../database/loggedInUser.d.ts';

export interface ContextData {
  servers?: LoggedInUser[1];
  user?: {
    id: string,
    avatar: string,
    username: string,
    discriminator: string
  }
}
