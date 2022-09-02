import { ContextProps } from '../../../../types/context';
import { Select } from './Select.tsx';

export function ServerSelect({ context: { user: { guilds } } }: ContextProps) {
  return (
    <Select options={guilds.map(({ id, icon, name }) => ({ id, label: name, icon }))} link="Guild/" />
  );
}