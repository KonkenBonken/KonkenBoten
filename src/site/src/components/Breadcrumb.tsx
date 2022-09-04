import { useLocation, NavLink } from "react-router-dom";

import { ContextProps } from '../../../../types/context';
import { titleCase, snowflakeRegex } from '../utils/utils.ts';

export default function Breadcrumb({ context: { user: { guilds } } }: ContextProps) {
  const { pathname } = useLocation(),
    pathnames = pathname.split('/'),
    entries = pathnames
      .map(entry =>
        guilds.find(guild => guild.id == entry) ?.name
          ?? titleCase(entry) as string
      )
      .filter(Boolean)
      .map((entry, i, paths) => (
        <NavLink to={pathnames.slice(0, i + 2).join('/')}>
          {entry}
        </NavLink>
      )).flatMap(entry => [(<span>></span>), entry]).slice(1);

  return entries.length ? <p className="breadcrumb">
    {entries}
  </p> : null;
}
