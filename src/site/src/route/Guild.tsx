import { useParams, Outlet } from "react-router-dom";

import { socket } from '../utils/socket.ts';
import { ContextProps } from '../utils/context';
import { Navigation } from '../components/Navigation.tsx';
import { BackgroundImage } from '../components/BackgroundImage.tsx';
import { Loading } from '../components/Loading.tsx';
import sections from '../sections/sections.ts';
import { titleCase as TC } from '../utils/utils.ts';

import '../styles/routes/guild.scss';

export default function Guild({ context, context: { guild, user }, setContext }: ContextProps) {
  const { guildId } = useParams(),
    contextProps = { context, setContext };

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
            <h2>{TC(name)}</h2>
      sections.map(({ name, children }) => (<>
        <Route path={name} exact key={name}
          element={
            Object.entries(children).map(([childName, Section]) => (<>
              <h3>{TC(childName)}</h3>
              <Section key={`${name}>${childName}`} {...contextProps} />
            </>))
          }
        />
        {Object.entries(children).map(([childName, Section]) =>
          (<Route path={`${name}/${childName}`} key={`${name}>${childName}`}
            element={<>
              <h2>{TC(name)}</h2>
              <h3>{TC(childName)}</h3>
              <Section key={`${name}>${childName}`} {...contextProps} />
            </>}
          />)
        )}
      </>))
    }</main>
  </>);
}
