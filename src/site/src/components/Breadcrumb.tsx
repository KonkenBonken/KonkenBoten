import { useLocation } from "react-router-dom";

import { ContextProps } from '../utils/context';
import { titleCase, snowflakeRegex } from '../utils/utils.ts';

export function Breadcrumb({ context: { user: { guilds } } }: ContextProps) {
  const { pathname } = useLocation(),
    entries = pathname.split('/')
      .map(entry =>
        guilds.find(guild => guild.id == entry) ?.name
          ?? entry
      )
      .filter(Boolean)
      .map(entry => (<span>{entry}</span>));

  return (<p className="breadcrumb">
    {entries}
  </p>);
}
