import { useState } from 'react';
import { ContextData } from '../utils/context';
import { DiscordImage } from './DiscordImage';
import { Select } from './Select';

export function ServerSelect({ user: { guilds } }: ContextData) {
  return (
    <Select options={guilds.map(({ id, icon, name }) => ({ id, label: name, icon }))} link="Guild/" />
  );
}
