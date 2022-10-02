import React from 'react';
import useLocalState from "@phntms/use-local-state";
import { NavLink } from "react-router-dom";

import { DiscordImage, GuildPlaceholder } from '../components/DiscordImage.tsx';
import { useContext } from '../hooks/Context.ts';

import '../styles/routes/guild-selector.scss';

export default function GuildSelector() {
  const [{ user: { guilds } }] = useContext(),
    [lastVisited] = useLocalState<string[]>('last-visited-guild', []);

  return <section id="selector">
    {guilds.slice()
      .sort(({ id: a }, { id: b }) => {
        if (lastVisited.includes(a) && lastVisited.includes(b))
          return lastVisited.indexOf(a) - lastVisited.indexOf(b);

        if (lastVisited.includes(a))
          return -1;
        if (lastVisited.includes(a))
          return 1;
        return 0;
      })
      .map(({ id, icon, name }) =>
        <NavLink to={id}>
          {icon ?
            <DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`} srcSizes={[64, 128, 256]} /> :
            <GuildPlaceholder name={name} />
          }
          <h3>{name}</h3>
        </NavLink>
      )}
  </section>;
}
