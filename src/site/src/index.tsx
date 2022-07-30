import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import './styles/index.scss';

import { Home } from './route/Home.tsx';
import { Guild } from './route/Guild.tsx';
import { GuildSelector } from './route/GuildSelector.tsx';
import { Header } from './components/Header.tsx';

import { ContextData } from './utils/context';
import { socket, connect } from './utils/socket.ts';
import { titleCase } from './utils/utils.ts';
import sections from './sections/sections.ts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ContextHandler />
  </StrictMode>
);

function ContextHandler() {
  const [context, setContext] = useState<ContextData>(contextData);

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
        <Route path="Guild/:guildId" element={<Guild context={context} setContext={setContext} />} >
          {sections.map(({ name, children }) => [
            (<Route path={name} exact key={name}
              element={<>
                <h2>{titleCase(name)}</h2>
                {Object.entries(children).map(([childName, Render]) => (<>
                  <h3>{titleCase(childName)}</h3>
                  <Render key={`${name}>${childName}`} context={context} setContext={setContext} />
                </>))}
              </>}
            />),
            ...Object.entries(children).map(([childName, Render]) =>
              (<Route path={`${name}/${childName}`} element={<>
                <h2>{titleCase(name)}</h2>
                <h3>{titleCase(childName)}</h3>
                <Render key={`${name}>${childName}`} context={context} setContext={setContext} />
              </>} />)
            )
          ])}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
