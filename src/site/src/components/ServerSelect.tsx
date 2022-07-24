import { useState } from 'react';
import { ContextData } from '../types.d.ts';
import { DiscordImage } from './DiscordImage.tsx';
import { Select } from './Select.tsx';

export function ServerSelect({ user: { guilds } }: ContextData) {
  return (
    <Select options={guilds.map(({ id, icon, name }) => ({ id, label: name, icon }))} link="Guild/" />
  );
}
