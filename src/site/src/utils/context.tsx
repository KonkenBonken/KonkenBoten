import { createContext } from 'react';
import { ContextData } from './types.d.ts';

const Context = createContext<ContextData>(contextData);

export const Provider = (props) => (<Context.Provider value={contextData} {...props} />);
export const Consumer = Context.Consumer;
