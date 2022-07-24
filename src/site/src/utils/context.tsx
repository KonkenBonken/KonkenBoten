import { createContext } from 'react';

import { LoggedInUserGuild } from '../../../../database/loggedInUser.d.ts';

export interface ContextData {
  user?: {
    id: string,
    avatar: string,
    username: string,
    discriminator: string,
    guilds?: LoggedInUserGuild
  }
}

const Context = createContext<ContextData>(contextData);

export const Provider = (props) => (<Context.Provider value={contextData} {...props} />);
export const Consumer = Context.Consumer;
