import { ReactComponent as Logo } from '../assets/icon.svg';
import { Consumer } from '../context.tsx';
import { ContextData } from '../types.d.ts';

export function Header() {
  return (
    <header>
      <Logo />
      <Consumer>
      </Consumer>
    </header>
  );
}
