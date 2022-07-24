import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import './styles/index.scss';

import { Home } from './route/Home';
import { Guild } from './route/Guild';
import { GuildSelector } from './route/GuildSelector';
import { Header } from './components/Header';
import { Provider } from './utils/context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Guild" element={<GuildSelector />} />
          <Route path="Guild/:guildId" element={<Guild />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
