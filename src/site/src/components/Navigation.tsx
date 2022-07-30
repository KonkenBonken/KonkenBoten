import { NavLink } from "react-router-dom";
import sections from '../sections/sections.ts';

function titleCase(string: string) {
  return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
}

export function Navigation() {
  return (<nav>
    {sections.flatMap(({ name, children }) => [
      <NavLink to={name} key={name} >{titleCase(name)}</NavLink>,
      ...Object.entries(children).map(([childName, Render]) => (
        <NavLink className="child" key={`${name}>${childName}`} to={`${name}/${childName}`}>
          {titleCase(childName)}
        </NavLink>
      ))
    ])}
  </nav>);
}
