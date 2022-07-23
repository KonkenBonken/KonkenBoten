import { Fragment } from 'react';
import { Consumer } from '../utils/context.tsx';
import { ContextData } from '../types.d.ts';

import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';

export function Header() {
  return (
    <header>
      <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      <Consumer>
        {({ user, servers }: ContextData) => {
          if (user)
            return (<Fragment>
              <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} className="avatar" />
              <ServerSelect servers={servers} />
            </Fragment>)
          else
            return (<a href="/oauth" class="login"><img src="/discord.svg" alt="Discord's Logo" /><p>Login</p></a>)
        }}
      </Consumer>
    </header>
  );
}
