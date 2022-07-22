import { Fragment } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import { Header } from './Header.tsx';
import { Navigation } from './Navigation.tsx';

function App() {
  return (
    <Fragment>
      <Header />
      <Router>
        <Navigation />
      </Router>
    </Fragment>
  );
}

export default App;
