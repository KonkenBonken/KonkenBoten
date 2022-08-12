import { StrictMode, useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import './styles/index.scss';

import { Header } from './components/Header.tsx';
import { Loading } from './components/Loading.tsx';

const Home = lazy(() => import('./route/Home.tsx'));
const Guild = lazy(() => import('./route/Guild.tsx'));
const GuildSelector = lazy(() => import('./route/GuildSelector.tsx'));

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
        <Route path="/" element={<Suspense fallback={<Loading />}>
          <Home context={context} />
        </Suspense>} />
        <Route path="Guild" element={<Suspense fallback={<Loading />}>
          <GuildSelector context={context} />
        </Suspense>} />
        <Route path="Guilds" element={<Navigate to="Guild" />} />
        <Route path="Guild/:guildId" element={<Suspense fallback={<Loading />}>
          <Guild context={context} setContext={setContext} />
        </Suspense>} >
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
