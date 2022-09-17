import { Route, Routes, Navigate } from "react-router-dom";

import { lazy } from '../components/Loading.tsx';

const Home = lazy(() => import('./Home.tsx'));
const Guild = lazy(() => import('./Guild.tsx'));
const GuildSelector = lazy(() => import('./GuildSelector.tsx'));

export function RouteHandler() {
  return (<Routes>
    <Route path="/" element={<Home />} />
    <Route path="Guild" element={<GuildSelector />} />
    <Route path="Guilds" element={<Navigate to="Guild" />} />
    <Route path="Guild/:guildId" element={<Guild />} />
    <Route path="Guild/:guildId/:section" element={<Guild />} />
    <Route path="Guild/:guildId/:section/:child" element={<Guild />} />
  </Routes>)
}
