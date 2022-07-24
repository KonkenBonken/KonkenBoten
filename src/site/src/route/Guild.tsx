import { Fragment } from 'react';
import { useParams } from "react-router-dom";

import { Navigation } from '../components/Navigation';

export function Guild() {
  const { guildId } = useParams() as { userId: number };

  return (
    <Fragment>
      <Navigation />
      <p>{guildId}</p>
    </Fragment>
  );
}
