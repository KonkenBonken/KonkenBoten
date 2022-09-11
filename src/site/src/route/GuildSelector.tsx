import { NavLink } from "react-router-dom";

import { DiscordImage, GuildPlaceholder } from '../components/DiscordImage.tsx';
import { ContextProps } from '../../../../types/context';

import '../styles/routes/guild-selector.scss';

export default function GuildSelector({ context: { user: { guilds } } }: ContextProps) {
  return <section id="selector">
    {guilds.map(({ id, icon, name }) =>
      <section>
        {icon ?
          <DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`} srcSizes={[64, 128, 256]} /> :
          <GuildPlaceholder name={name} />
        }
        <h3>{name}</h3>
        <NavLink to={id}>Go</NavLink>
      </section>
    )}
  </section>;
}
