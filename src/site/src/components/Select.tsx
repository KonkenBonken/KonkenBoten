import { useState } from 'react';
import { DiscordImage, GuildPlaceholder } from './DiscordImage.tsx';

export function Select({ options, initialSelected, guildIcons = true, onChoice }: { options: { id?: string, label: string, icon?: string }[], initialSelected: string, onChoice?: () => void }) {
  for (const option of options)
    option.id ??= option.label;

  const [open, setOpen] = useState(false),
    displayIcons = guildIcons && options.some(option => option.icon),
    [selectedId, setSelectedId] = useState(initialSelected),
    selected = options.find(option => option.id == selectedId) || options[0],
    [searchQuery, setSearchQuery] = useState('');

  if (!options.some(option => option.id == selectedId))
    setSelectedId(options[0].id)

  return (<div className={'select' + (open ? ' open' : '')}>
    <input className="search"
      defaultValue={selected.label}
      onFocus={({ target }) => target.value = ''}
      onBlur={({ target }) => target.value = selected.label}
      onChange={({ target }) => setSearchQuery(target.value)}
    />
    {options.filter(({ label, id }) => [label, id].some(text => text.includes(searchQuery)))
      .map(({ label, id, icon }) => (
        <div key={id} id={id}
          className={selectedId == id ? 'active' : ''}
          onClick={({ target }) => {
            setSelectedId(id);
            onChoice && onChoice(id);
          }}>

          {displayIcons && (icon ?
            <DiscordImage src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
              srcSizes={[16, 32, 64]} /> :
            <GuildPlaceholder name={label} />
          )}

          <span>{label}</span>
        </div>
      ))}
  </div>)
}
