import { StrictMode, useState, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import './styles/index.scss';

import { Header } from './components/Header.tsx';
import { lazy } from './components/Loading.tsx';

const Home = lazy(() => import('./route/Home.tsx'), true);
const Guild = lazy(() => import('./route/Guild.tsx'), true);
const GuildSelector = lazy(() => import('./route/GuildSelector.tsx'));

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
      <Routes>
        <Route path="/" element={<Home context={context} />} />
        <Route path="Guild" element={<GuildSelector context={context} />} />
        <Route path="Guilds" element={<Navigate to="Guild" />} />
        <Route path="Guild/:guildId" element={<Guild {...contextProps} />} />
      </Routes>
    </BrowserRouter>
  );
}
