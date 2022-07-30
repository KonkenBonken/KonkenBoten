import { ReactElement } from 'react';

import { SupportChannelSettings } from './SupportChannelSettings.tsx';

export default [
  {
    name: 'commands',
    children: {
      auto_reaction() { },
      commands() { },
      custom_commands() { },
    }
  },
  {
    name: 'dynamic_voice_channels',
    children: {
      _index() { }
    }
  },
  {
    name: 'moderation',
    children: {
      moderation() { },
      auto_moderation() { },
      logging() { },
      infractions() { },
    }
  },
  {
    name: 'suggestions',
    children: {
      settings() { },
      suggestions() { },
    }
  },
  {
    name: 'support_channels',
    children: {
      settings: SupportChannelSettings,
      transcripts() { },
    }
  }
] as {
  name: string,
  children: Record<string, () => ReactElement>
}[];
