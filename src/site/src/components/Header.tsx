import { useLocation, NavLink } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';
import { ContextProps } from '../utils/types';
import { lazy } from './Loading.tsx';
import { isMobile } from '../utils/utils.ts';

const NavButton = lazy(() => import('../components/NavButton.tsx'));
const Breadcrumb = lazy(() => import('./Breadcrumb.tsx'), true);

export function Header({ context, context: { user } }: ContextProps) {
  const { pathname } = useLocation();

  return (
    <header>
      {isMobile() && /guild\/\d+/i.test(pathname) ?
        <NavButton /> :
        <NavLink to="/">
          <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
        </NavLink>}
      {!isMobile() && <Breadcrumb context={context} />}
      {user ?
        [
          !isMobile() && <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[64]} className="avatar" />,
          <ServerSelect servers={user.guilds} context={context} />
        ] :
        (<a href="/oauth" class="login">
          <img src="/discord.svg" alt="Discord's Logo" />
          <p>Login</p>
        </a>)}
    </header>
  );
}
