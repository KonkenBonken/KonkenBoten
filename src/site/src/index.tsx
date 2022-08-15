import { StrictMode, useState, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";

import './styles/index.scss';

import { RouteHandler } from './route/RouteHandler.tsx';
import { Header } from './components/Header.tsx';

import { ContextData } from './utils/context';
import { socket, connect } from './utils/socket.ts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ContextHandler />
  </StrictMode>
);

function ContextHandler() {
  const [context, setContext] = useState<ContextData>(contextData),
    contextProps = { context, setContext };

  if (context.user)
    connect(context.user.id)
  else
    socket.disconnect();

  return (
    <BrowserRouter>
      <Header context={context} />
      <RouteHandler {...contextProps} />
    </BrowserRouter >
  );
}
