import { NavLink } from "react-router-dom";

import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';
import { ContextProps } from '../../../../types/context';

import { lazy } from '../components/Loading.tsx';
const Breadcrumb = lazy(() => import('./Breadcrumb.tsx'), true);

export function Header({ context, context: { user } }: ContextProps) {
  return (
    <header>
      <NavLink to="/">
        <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      </NavLink>
      <Breadcrumb context={context} />
      {user ?
        (<>
          <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[64]} className="avatar" />
          <ServerSelect servers={user.guilds} context={context} />
        </>) :
        (<a href="/oauth" class="login">
          <img src="/discord.svg" alt="Discord's Logo" />
          <p>Login</p>
        </a>)}
    </header>
  );
}
