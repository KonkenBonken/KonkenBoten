import { NavLink } from "react-router-dom";
import { Title } from '../components/Title.tsx';
import { ContextProps } from '../utils/types';

import '../styles/routes/home.scss';

export default function Home({ context: { user } }: ContextProps) {
  return (<>
    <Title />
    {user && <NavLink id="select-server" to="Guild">
      Select Server
    </NavLink>}
  </>);
}
