import React from 'react';
import { useContext } from '../hooks/Context.ts';
import { Select } from './Select.tsx';

export function ServerSelect() {
  const [{ user: { guilds } }] = useContext();

  return (
    <Select options={guilds.map(({ id, icon, name }) => ({ id, label: name, icon }))} link="Guild/" />
  );
}
