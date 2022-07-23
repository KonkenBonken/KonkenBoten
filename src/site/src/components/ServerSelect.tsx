import { useState } from 'react';
import { ContextData } from '../types.d.ts';
import { DiscordImage } from './DiscordImage.tsx';
import { Select } from './Select.tsx';

export function ServerSelect({ servers }: ContextData) {
  return (
    <Select options={servers.map(({ id, icon, name }) => ({ id, label: name, icon }))} />
  );
}
