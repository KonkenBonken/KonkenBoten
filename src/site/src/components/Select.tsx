import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

import { SelectOptions, SelectOptionsItem, SelectOptionsItemWithId } from '../utils/types';

import searchIcon from '../assets/search.svg';
import { DiscordImage, GuildPlaceholder } from './DiscordImage.tsx';

let normalizeString = (label: string) => label;
import(/* webpackChunkName: "AnyAscii", webpackPreload: true */ 'any-ascii').then(pkg => normalizeString = pkg.default)

export function Select({ options, onChoice, link }: SelectOptions) {
  function defaultId(options: SelectOptionsItem[]): asserts options is SelectOptionsItemWithId[] {
    for (const option of options)
      option.id ??= option.label;
  }
  defaultId(options);

  const
    displayIcons = options.some(option => option.icon),
    [searchQuery, setSearchQuery] = useState(''),
    [active, setActive] = useState<string>();

  function Option({ id, label, icon }: SelectOptionsItemWithId) {
    let Icon = <></>;
    if (displayIcons) {
      if (icon)
        Icon = <DiscordImage
          src={`https://cdn.discordapp.com/icons/${id}/${icon}`}
          srcSizes={[64]}
        />
      else
        Icon = <GuildPlaceholder name={label} />
    }

    if (link) {
      return <NavLink id={id} to={link + id}>
        {Icon}
        <span title={label}>{label}</span>
      </NavLink>
    } else {
      function onClick() {
        if (onChoice)
          onChoice(id);
        setActive(id);
      }

      return <div id={id} className={active == id ? 'active' : ''} onClick={onClick} tabIndex={0}>
        {Icon}
        <span title={label}>{label}</span>
      </div>
    }
  }

  return <div className="select">
    <input className="search" type="search"
      placeholder="Search"
      onFocus={({ target }) => target.value = ''}
      onChange={({ target }) => setSearchQuery(target.value)}
    />
    <img src={searchIcon} />
    <div className="options">{
      options.filter(({ label, id }) => [label, id, normalizeString(label)]
        .some(text => text.toLowerCase().includes(searchQuery.toLowerCase()))
      )
        .map(opt => <Option key={opt.id} {...opt} />)
    }</div>
  </div>
}