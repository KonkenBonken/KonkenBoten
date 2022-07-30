import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import './styles/index.scss';

import { Home } from './route/Home.tsx';
import { Guild } from './route/Guild.tsx';
import { GuildSelector } from './route/GuildSelector.tsx';
import { Header } from './components/Header.tsx';

import { ContextData } from './utils/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider>
      <ContextHandler />
    </Provider>
  </StrictMode>
);

function ContextHandler() {
  const [context, setContext] = useState<ContextData>({});

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home context={context} />} />
        <Route path="Guild" element={<GuildSelector context={context} />} />
        <Route path="Guilds" element={<Navigate to="Guild" />} />
        <Route path="Guild/:guildId" element={<Guild context={context} setContext={setContext} />} />
      </Routes>
    </BrowserRouter>
  );
}
