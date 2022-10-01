import { BrowserRouter } from "react-router-dom";

import { useContext } from '../hooks/Context.ts';

import { connect, socket } from './socket.ts';

import { BackgroundImage } from '../components/BackgroundImage.tsx';
import { Header } from '../components/Header.tsx';
import { RouteHandler } from '../route/RouteHandler.tsx';

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
