import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import './styles/index.scss';

import { Home } from './route/Home.tsx';
import { Guild } from './route/Guild.tsx';
import { GuildSelector } from './route/GuildSelector.tsx';
import { Header } from './components/Header.tsx';
import { Provider } from './utils/context.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Guild" element={<GuildSelector />} />
          <Route path="Guilds" element={<Navigate to="Guild" />} />
          <Route path="Guild/:guildId" element={<Guild />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
