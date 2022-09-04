import { useState } from 'react';
import { BrowserRouter } from "react-router-dom";

import { ContextData } from '../../../../types/context';
import { PartialGuild } from '../../../../types/guild';

import { socket, connect, contextResolver } from './socket.ts';

import { RouteHandler } from '../route/RouteHandler.tsx';
import { Header } from '../components/Header.tsx';
import { BackgroundImage } from '../components/BackgroundImage.tsx';

export default function ContextHandler() {
  const [context, setContext] = useState<ContextData>(contextData),
    [changes, setChanges] = useState<PartialGuild[]>([]);

  window.setChanges = setChanges;

  contextResolver([(a) => setContext(a), (a) => setChanges(a)]);

  if (context.user)
    connect(context.user.id)
  else
    socket.disconnect();

  return (
    <BrowserRouter>
      <BackgroundImage />
      <Header context={context} />
      <RouteHandler {...{ context, setContext, changes }} />
    </BrowserRouter >
  );
}