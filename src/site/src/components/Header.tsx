import { Consumer } from '../utils/context.tsx';
import { ContextData } from '../types.d.ts';

import { DiscordImage } from './DiscordImage.tsx';

export function Header() {
  return (
    <header>
      <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      <Consumer>
        {({ user }: ContextData) => {
          if (user)
            return (<DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} className="avatar" />)
        }}
      </Consumer>
    </header>
  );
}
