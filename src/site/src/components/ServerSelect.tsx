import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { ContextData } from '../types.d.ts';
import { DiscordImage } from './DiscordImage.tsx';

export function ServerSelect({ servers }: ContextData) {
  return (
    <div className="server-select" role="navigation">
      {servers.map(({ id, icon, name }) => (
        <NavLink to={'Guild/' + id} key={id}>
          {icon && (<DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`} />)}
          {name}
        </NavLink>
      ))}
    </div>
  );
}
