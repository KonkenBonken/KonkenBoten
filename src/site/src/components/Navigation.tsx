import { NavLink as Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <Link to="moderation">Moderation</Link>
      <Link to="suggestion">Suggestion</Link>
      <Link to="support-channels">Support Channels</Link>
      <Link to="logging">Logging</Link>
      <Link to="dynamic-voice-channels">Dynamic Voice Channels</Link>
    </nav>
  );
}
