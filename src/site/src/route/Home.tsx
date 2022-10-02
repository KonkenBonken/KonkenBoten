import React from 'react';
import { NavLink } from "react-router-dom";
import { Title } from '../components/Title.tsx';
import { useContext } from '../hooks/Context.ts';

import '../styles/routes/home.scss';

export default function Home() {
  const [{ user }] = useContext();

  return (<>
    <Title />
    {user && <NavLink id="select-server" to="Guild">
      Select Server
    </NavLink>}
  </>);
}
