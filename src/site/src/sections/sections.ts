import { lazy } from '../components/Loading.tsx';

const sections = [
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
      settings: 'SupportChannelSettings',
      transcripts: null,
    }
  }
] as {
  name: string,
  children: Record<string, string | null>
}[]

export default sections.map(({ name, children }) => {
  for (const key in children)
    if (children[key])
      children[key] = lazy(() => import(
        /* webpackChunkName: "[request]", webpackPrefetch: true */
        `./${children[key]}.tsx`
      ));

  return { name, children };
}) as {
  name: string,
  children: Record<string, null | (() => Promise)>
}[];
