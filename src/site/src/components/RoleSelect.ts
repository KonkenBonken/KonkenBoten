import { useContext } from '../hooks/Context.ts';
import { ContextData } from '../utils/types';

import { Select } from './Select.tsx';

export function RoleSelect({ onChoice }: { onChoice?(string): void }) {
  const [{ guild: { discord: { roles } } }] = useContext() as [Required<ContextData>];

  return Select({
    options: roles.map(({ id, name }) => ({ id, label: name })),
    onChoice
  });
}