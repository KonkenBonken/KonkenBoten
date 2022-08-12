import { ReactElement } from 'react';

import { lazy } from '../components/Loading.tsx';

const SupportChannelSettings = lazy(() => import('./SupportChannelSettings.tsx'));

export default [
  {
    name: 'commands',
    children: {
      documentation() { },
      auto_reaction() { },
      custom_commands() { },
    }
  },
  {
    name: 'dynamic_voice_channels',
    children: {
      settings() { }
    }
  },
  {
    name: 'moderation',
    children: {
      settings() { },
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
