import { useState } from 'react';
import { ContextData } from '../utils/types';

export let globalContext: ContextData = contextData;

const setStates = new Set(),
  forceRerenders = new Set();

export function useContext(forceRerender) {
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

  return [context, setContext];
}

