import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import Router from './utils/Router.tsx';

import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router />
  </StrictMode>
);
