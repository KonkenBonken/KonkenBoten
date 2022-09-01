import { useState } from 'react';
import { NavLink } from "react-router-dom";
import normalizeString from 'any-ascii';
import { DiscordImage, GuildPlaceholder } from './DiscordImage.tsx';

export function Select({ options, guildIcons = true, onChoice, link }: { options: { id?: string, label: string, icon?: string }[], onChoice?: (string) => void, link?: string }) {
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
      onFocus={({ target }) => target.value = ''}
      onChange={({ target }) => setSearchQuery(target.value)}
    />
    {options.filter(({ label, id }) => [label, id, normalizeString(label)].some(text => text.toLowerCase().includes(searchQuery.toLowerCase())))
      .map(({ label, id, icon }) => (
        <Option id={id} key={id}>
          {displayIcons && (icon ?
            <DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
              srcSizes={[64]} /> :
            <GuildPlaceholder name={label} />
          )}
          <span>{label}</span>
        </Option>
      ))}
  </div>)
}
