import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import './styles/index.scss';

import { Home } from './route/Home.tsx';
import { Guild } from './route/Guild.tsx';
import { GuildSelector } from './route/GuildSelector.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Guild" element={<GuildSelector />} />
        <Route path="Guild/:guildId" element={<Guild />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
