import { DiscordImage } from './DiscordImage.tsx';
import { ServerSelect } from './ServerSelect.tsx';
import { ContextProps } from '../utils/context';

export function Header({ context: { user } }: ContextProps) {
  return (
    <header>
      <img className="logo" src="/icon.svg" alt="KonkenBoten's Logo" />
      {user ?
        (<>
          <DiscordImage src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} srcSizes={[16, 32, 64]} className="avatar" />
          <ServerSelect servers={user.guilds} />
        </>) :
        (<a href="/oauth" class="login">
          <img src="/discord.svg" alt="Discord's Logo" />
          <p>Login</p>
        </a>)}
    </header>
  );
}
