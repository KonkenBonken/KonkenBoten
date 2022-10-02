import { NavLink, useLocation } from "react-router-dom";

import { useContext } from '../hooks/Context.ts';
import { isMobile } from '../utils/utils.ts';
import { DiscordImage } from './DiscordImage.tsx';
import { lazy } from './Loading.tsx';
import { ServerSelect } from './ServerSelect.tsx';

const NavButton = lazy(() => import(/* webpackChunkName: "NavButton" */ '../components/NavButton.tsx'));
const Breadcrumb = lazy(() => import(/* webpackChunkName: "Breadcrumb" */ './Breadcrumb.tsx'), true);

export function Header() {
  const { pathname } = useLocation(),
    [{ user }] = useContext();

  return (
    <header>
      {isMobile() && /guild\/\d+/i.test(pathname) ?
        <NavButton /> :
        <NavLink to="/">
          <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
        </NavLink>}
      {!isMobile() && <Breadcrumb />}
      {user ?
        [
          !isMobile() && <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[64]} className="avatar" />,
          <ServerSelect servers={user.guilds} />
        ] :
        (<a href="/oauth" class="login">
          <img src="/discord.svg" alt="Discord's Logo" />
          <p>Login</p>
        </a>)}
    </header>
  );
}
