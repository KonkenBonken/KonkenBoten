import { useState } from 'react';
import { PartialGuild } from '../../../../types/guild';

export const globalChanges: PartialGuild[] = [];

const setStates = new Set<PartialGuild[] | ((prev: PartialGuild[]) => PartialGuild[])>(),
  forceRerenders = new Set<() => void>();

export function useChanges(forceRerender: () => void) {
  const [changes, setChanges] = useState<PartialGuild[]>(globalChanges);

  setStates.add(setChanges);

  if (forceRerender)
    forceRerenders.add(forceRerender);

  function addChange(change: PartialGuild) {
    globalChanges.push(change);
    setChanges(globalChanges);
    for (const forceRerender of forceRerenders)
      forceRerender();
  }

  function clearChanges() {
    globalChanges.length = 0;
    setChanges(globalChanges);
    for (const forceRerender of forceRerenders)
      forceRerender();
  }

  return [changes, addChange, clearChanges] as const;
}

export function clearChanges() {
  globalChanges.length = 0;
  for (const setChanges of setStates)
    setChanges(globalChanges);
}
