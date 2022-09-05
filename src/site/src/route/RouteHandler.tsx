import { Route, Routes, Navigate } from "react-router-dom";

import { lazy } from '../components/Loading.tsx';
import { ContextProps } from '../../../../types/context';

const Home = lazy(() => import('./Home.tsx'));
const Guild = lazy(() => import('./Guild.tsx'));
const GuildSelector = lazy(() => import('./GuildSelector.tsx'));

export function RouteHandler(contextProps: ContextProps) {
  return (<Routes>
    <Route path="/" element={<Home {...contextProps} />} />
    <Route path="Guild" element={<GuildSelector {...contextProps} />} />
    <Route path="Guilds" element={<Navigate to="Guild" />} />
    <Route path="Guild/:guildId" element={<Guild {...contextProps} />} />
    <Route path="Guild/:guildId/:section" element={<Guild {...contextProps} />} />
    <Route path="Guild/:guildId/:section/:child" element={<Guild {...contextProps} />} />
  </Routes>)
}
