import { useParams, Outlet } from "react-router-dom";

import { socket } from '../utils/socket.ts';
import { ContextProps } from '../utils/context';
import { Navigation } from '../components/Navigation.tsx';
import { BackgroundImage } from '../components/BackgroundImage.tsx';
import { Loading } from '../components/Loading.tsx';

export function Guild({ context: { guild, user }, setContext }: ContextProps) {
  const { guildId } = useParams();

  if (!guild)
    socket.emit('getGuild', guildId, (res, err) => {
      if (err) return console.error('Could not fetch guild', { err });
      setContext(prev => ({ ...prev, guild: res }))
    })
  else if (guild.id !== guildId)
    setContext(prev => ({ ...prev, guild: undefined }));

  return (<>
    <BackgroundImage />
    <Navigation />
    <main>{!guild ?
      <Loading /> :
      (<Outlet />)
    }</main>
  </>);
}
