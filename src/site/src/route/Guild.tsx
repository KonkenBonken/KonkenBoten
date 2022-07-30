import { useParams } from "react-router-dom";

import { Navigation } from '../components/Navigation.tsx';

export function Guild() {
  const { guildId } = useParams() as { userId: number };

  return (
    <>
      <Navigation />
      <p>{guildId}</p>
    </>
  );
}
