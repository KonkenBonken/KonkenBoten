import { NavLink } from "react-router-dom";

function Link({ to, paths = [] }: { to: string, paths: string[] }) {
  const path = to.toLowerCase().replace(/\s/g, '-');

  return (<>
    <NavLink to={path}>{to}</NavLink>
    {paths.map(to => {
      const childPath = path + '/' + to.toLowerCase().replace(/\s/g, '-');
      return (<NavLink className="child" key={childPath} to={childPath}>{to}</NavLink>)
    })}
  </>)
}

export function Navigation() {
  return (
    <nav>
      <Link to="Commands" paths={['Auto Reaction', 'Commands', 'Custom Commands']} />
      <Link to="Dynamic Voice Channels" />
      <Link to="Moderation" paths={['Moderation', 'Auto Moderation', 'Logging', 'Infractions']} />
      <Link to="Suggestions" paths={['Settings', 'Suggestions']} />
      <Link to="Support Channels" paths={['Settings', 'Transcripts']} />
    </nav>
  );
}
