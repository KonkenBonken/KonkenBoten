import { Fragment } from 'react';
import { useParams } from "react-router-dom";

import { Header } from '../components/Header.tsx';
import { Navigation } from '../components/Navigation.tsx';

export function Guild() {
  const { guildId } = useParams() as { userId: number };

  return (
    <Fragment>
      <Header />
      <Navigation />
      <p>{guildId}</p>
    </Fragment>
  );
}
