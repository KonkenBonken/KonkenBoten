import { useState } from 'react';
import { PartialGuild } from '../../../../types/guild';

export const globalChanges: PartialGuild[] = [];

const setStates = new Set(),
  forceRerenders = new Set();

export function useChanges(forceRerender) {
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

  return [changes, addChange, clearChanges];
}

export function clearChanges() {
  globalChanges.length = 0;
  for (const setChanges of setStates)
    setChanges(globalChanges);
}
