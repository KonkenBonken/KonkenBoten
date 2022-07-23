import { Consumer } from '../context.tsx';
import { ContextData } from '../types.d.ts';

export function Header() {
  return (
    <header>
      <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      <Consumer>
      </Consumer>
    </header>
  );
}
