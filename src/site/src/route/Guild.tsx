import { useParams } from "react-router-dom";

import { socket } from '../utils/socket.ts';
import { ContextProps } from '../../../../types/context';
import { titleCase as TC } from '../utils/utils.ts';

import { Navigation } from '../components/Navigation.tsx';
import { Loading, lazy } from '../components/Loading.tsx';
import sections from '../sections/sections.ts';

const ChangesPopup = lazy(() => import('../components/ChangesPopup.tsx'), false, true);

import '../styles/routes/guild.scss';

export default function Guild({ context, context: { guild, user }, setContext, changes }: ContextProps) {
  const { guildId, section, child } = useParams();

  if (!guild)
    socket.emit('getGuild', guildId, (res, err) => {
      if (err) return console.error('Could not fetch guild', { err });
      setContext(prev => ({ ...prev, guild: res }))
    })
  else if (guild.id !== guildId)
    setContext(prev => ({ ...prev, guild: undefined }));

  function Child(child: string, Render: () => JSX.Element) {
    return (<>
      <h3>{TC(child)}</h3>
      {Render ?
        <Render {...{ context, setContext }} />
        : <section />
      }
    </>);
  }

  function Section({ name: section, children }: { name: string, children: Record<string, () => JSX.Element> }) {
    return (<>
      <h2>{TC(section)}</h2>
      {Object.entries(children).map(child => Child(...child))}
    </>);
  }

  return (<>
    <Navigation guildId={guildId} />
    <main>
      {!guild ? (<Loading />) :
        (section ? (
          child ? [
            <h2>{TC(section)}</h2>,
            Child(child, sections.find(({ name }) => name == section).children[child])
          ] :
            Section(sections.find(({ name }) => name == section))
        ) : sections.map(Section)
        )}
    </main>
    {!!changes.length && <ChangesPopup changes={changes} />}
  </>);
}
