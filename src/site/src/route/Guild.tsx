import useLocalState from "@phntms/use-local-state";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useChanges } from '../hooks/Changes.ts';
import { useContext } from '../hooks/Context.ts';
import { socket } from '../utils/socket.ts';
import { titleCase as TC } from '../utils/utils.ts';

import { lazy, Loading } from '../components/Loading.tsx';
import { Navigation } from '../components/Navigation.tsx';
import sections from '../sections/sections.ts';

const ChangesPopup = lazy(() => import(/* webpackChunkName: "ChangesPopup", webpackPreload: true */ '../components/ChangesPopup.tsx'), true);

import '../styles/routes/guild.scss';

export default function Guild() {
  const { guildId, section, child } = useParams(),
    [{ guild, user }, setContext] = useContext(),
    [, setLastVisited] = useLocalState<string[]>('last-visited-guild', []),
    [changes] = useChanges();

  useEffect(() => {
    setLastVisited(lastVisited => [...new Set([guildId, ...lastVisited])]);
  }, [guildId]);

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
      {Render ? <Render /> : <section />
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
    <ChangesPopup changes={changes} />
  </>);
}
