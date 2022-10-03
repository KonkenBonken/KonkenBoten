import { useState } from 'react';
import { ContextData } from '../utils/types';

declare global {
  interface Window {
    contextData: ContextData
  }
}

const { contextData } = window;
export let globalContext = contextData;

const setStates = new Set<ContextData | ((prev: ContextData) => ContextData)>(),
  forceRerenders = new Set<() => void>();

export function useContext(forceRerender?: () => void) {
  const [context, setState] = useState<ContextData>(globalContext);

  setStates.add(setState);

  if (forceRerender)
    forceRerenders.add(forceRerender);

  function setContext(value?: ContextData | ((prev: ContextData) => ContextData)) {
    if (typeof value === 'function')
      globalContext = value(globalContext);
    else
      globalContext = value;

    for (const setState of setStates)
      setState(globalContext);
    for (const forceRerender of forceRerenders)
      forceRerender();
  }

  return [context, setContext] as const;
}
