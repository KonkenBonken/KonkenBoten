import { useParams } from "react-router-dom";

import { socket } from '../utils/socket.ts';
import { ContextProps } from '../utils/context';
import { Navigation } from '../components/Navigation.tsx';

export function Guild({ context: { guild, user }, setContext }: ContextProps) {
  const { guildId } = useParams();

  if (!guild)
    socket.emit('getGuild', guildId, (res, err) => {
      if (err) return console.error('Could not fetch guild', { err });
      setContext(prev => ({ ...prev, guild: res }))
    })

  return (
    <>
      <Navigation />
      <pre>{guild ? JSON.stringify(guild, ' ', 2) : 'Loading...'}</pre>
    </>
  );
}
