import { lazy } from '../components/Loading.tsx';

export default [
  {
    name: 'commands',
    children: {
      documentation: null,
      auto_reaction: null,
      custom_commands: null,
    }
  },
  {
    name: 'dynamic_voice_channels',
    children: {
      settings: null
    }
  },
  {
    name: 'moderation',
    children: {
      settings: null,
      auto_moderation: null,
      logging: null,
      infractions: null,
    }
  },
  {
    name: 'suggestions',
    children: {
      settings: null,
      suggestions: null,
    }
  },
  {
    name: 'support_channels',
    children: {
      settings: lazy(() => import('./SupportChannelSettings.tsx')),
      transcripts: null,
    }
  }
] as {
  name: string,
  children: Record<string, () => Promise> | Record<string, null>
}[];
