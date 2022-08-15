import { useParams } from "react-router-dom";

import { socket } from '../utils/socket.ts';
import { ContextProps } from '../utils/context';
import { Navigation } from '../components/Navigation.tsx';
import { BackgroundImage } from '../components/BackgroundImage.tsx';
import { Loading } from '../components/Loading.tsx';
import sections from '../sections/sections.ts';
import { titleCase as TC } from '../utils/utils.ts';

import '../styles/routes/guild.scss';

export default function Guild({ context, context: { guild, user }, setContext }: ContextProps) {
  const { guildId, section, child } = useParams(),
    contextProps = { context, setContext };

  if (!guild)
    socket.emit('getGuild', guildId, (res, err) => {
      if (err) return console.error('Could not fetch guild', { err });
      setContext(prev => ({ ...prev, guild: res }))
    })
  else if (guild.id !== guildId)
    setContext(prev => ({ ...prev, guild: undefined }));

  function Child(child: string, Render: ({ contextProps }: { contextProps: ContextProps }) => JSX.Element) {
    return (<>
      <h3>{TC(child)}</h3>
      <Render key={child} {...contextProps} />
    </>);
  }

  function Section({ name: section, children }: { name: string, children: Record<string, () => JSX.Element> }) {
    return (<>
      <h2>{TC(section)}</h2>
      {Object.entries(children).map(child => Child(...child))}
    </>);
  }

  return (<>
    <BackgroundImage />
    <Navigation />
    <main>
      {!guild ? (<Loading />) :
        (section ? (
          child ?
            Child(child, sections.find(({ name }) => name == section).children[child]) :
            Section(sections.find(({ name }) => name == section))
        ) : sections.map(Section)
        )}
    </main>
  </>);
}
// (sections.map(({ name, children }) => (<>

// </>)))
