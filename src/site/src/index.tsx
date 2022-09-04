import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import ContextHandler from './utils/ContextHandler.tsx';

import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ContextHandler />
  </StrictMode>
);
