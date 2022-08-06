import { NavLink } from "react-router-dom";

import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';
import { Breadcrumb } from './Breadcrumb.tsx';
import { ContextProps } from '../utils/context';

export function Header({ context }: ContextProps) {
  const { user } = context;

  return (
    <header>
      <NavLink to="/">
        <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      </NavLink>
      <Breadcrumb context={context} />
      {user ?
        (<>
          <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[16, 32, 64]} className="avatar" />
          <ServerSelect servers={user.guilds} context={context} />
        </>) :
        (<a href="/oauth" class="login">
          <img src="/discord.svg" alt="Discord's Logo" />
          <p>Login</p>
        </a>)}
    </header>
  );
}
