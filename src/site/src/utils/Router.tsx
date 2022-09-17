import { useState } from 'react';
import { BrowserRouter } from "react-router-dom";

import { useContext } from '../hooks/Context.ts';
import { ContextData } from '../utils/types';
import { PartialGuild } from '../../../../types/guild';

import { socket, connect } from './socket.ts';

import { RouteHandler } from '../route/RouteHandler.tsx';
import { Header } from '../components/Header.tsx';
import { BackgroundImage } from '../components/BackgroundImage.tsx';

export default function Router() {
  const [{ user }] = useContext();

  if (user)
    connect(user.id)
  else
    socket.disconnect();

  return (
    <BrowserRouter>
      <BackgroundImage />
      <Header />
      <RouteHandler />
    </BrowserRouter >
  );
}
