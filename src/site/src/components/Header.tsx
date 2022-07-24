import { Fragment } from 'react';
import { Consumer, ContextData } from '../utils/context.tsx';

import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';

export function Header() {
  return (
    <header>
      <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      <Consumer>
        {({ user }: ContextData) => {
          if (user)
            return (<Fragment>
              <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[16, 32, 64]} className="avatar" />
              <ServerSelect servers={user.guilds} />
            </Fragment>)
          else
            return (<a href="/oauth" class="login"><img src="/discord.svg" alt="Discord's Logo" /><p>Login</p></a>)
        }}
      </Consumer>
    </header>
  );
}
