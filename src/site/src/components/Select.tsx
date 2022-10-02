import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { SelectOptions } from '../utils/types';

import searchIcon from '../assets/search.svg';
import { DiscordImage, GuildPlaceholder } from './DiscordImage.tsx';

let normalizeString = (label: string) => label;
import(/* webpackChunkName: "AnyAscii" */ 'any-ascii').then(pkg => normalizeString = pkg.default)

export function Select({ options, guildIcons = true, onChoice, link }: SelectOptions) {
  for (const option of options)
    option.id ??= option.label;

  const
    displayIcons = guildIcons && options.some(option => option.icon),
    [searchQuery, setSearchQuery] = useState('');

  function Option({ id, children }: { id: string }) {
    function onClick() {
      onChoice && onChoice(id);
      document.activeElement.blur()
    }

    if (link)
      return (<NavLink to={link + id} onClick={onClick}>{children}</NavLink>)
    else
      return (<div id={id} onClick={onClick}>{children}</div>)
  }

  return (<div className="select">
    <input className="search" type="search"
      placeholder="Search"
      onFocus={({ target }) => target.value = ''}
      onChange={({ target }) => setSearchQuery(target.value)}
    />
    <img src={searchIcon} />
    {options.filter(({ label, id }) => [label, id, normalizeString(label)].some(text => text.toLowerCase().includes(searchQuery.toLowerCase())))
      .map(({ label, id, icon }) => (
        <Option id={id} key={id}>
          {displayIcons && (icon ?
            <DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
              srcSizes={[64]} /> :
            <GuildPlaceholder name={label} />
          )}
          <span title={label}>{label}</span>
        </Option>
      ))}
  </div>)
}
