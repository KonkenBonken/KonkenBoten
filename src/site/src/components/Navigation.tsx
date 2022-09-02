import { NavLink } from "react-router-dom";
import sections from '../sections/sections.ts';

import { titleCase } from '../utils/utils.ts';

export function Navigation({ guildId }: { guildId: string }) {
  return (<nav>
    {sections.flatMap(({ name, children }) => [
      <NavLink to={`/Guild/${guildId}/${name}`} key={name} >{titleCase(name)}</NavLink>,
      ...Object.entries(children).map(([childName, Render]) => (
        <NavLink className="child" key={childName} to={`/Guild/${guildId}/${name}/${childName}`}>
          {titleCase(childName)}
        </NavLink>
      ))
    ])}
  </nav>);
}