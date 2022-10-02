import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";

import { lazy } from '../components/Loading.tsx';

const Home = lazy(() => import(/* webpackChunkName: "Home", webpackPrefetch: true */ './Home.tsx'));
const Guild = lazy(() => import(/* webpackChunkName: "Guild", webpackPrefetch: true */ './Guild.tsx'));
const GuildSelector = lazy(() => import(/* webpackChunkName: "GuildSelector" */ './GuildSelector.tsx'));

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
