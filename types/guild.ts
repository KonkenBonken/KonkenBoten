import { Snowflake, DeepPartial, DeepRequired } from './Utils';

import { TextCommandRule } from './TextCommandRule';
import { TicketSettings } from './TicketSettings';
import { SuggestionSettings } from './SuggestionSettings';
import { ModerationSettings } from './ModerationSettings';

interface VoiceCommandRule {
  channel: Snowflake;
  Userlimit?: number; //Bug: may be string
  channelname: string;
  disabled?: boolean;
}

interface LogSettings {
  enabled: string[];
  channel: Snowflake;
  color?: string;
  on?: boolean;
  audit?: boolean;
}

export interface Guild {
  /** @deprecated */ prefix?: string;
  TextCommandRules?: TextCommandRule[];
  VoiceRules?: VoiceCommandRule[];
  Tickets?: TicketSettings;
  Suggestions?: SuggestionSettings;
  logs?: LogSettings;
  /** @deprecated */ commands?: Record<string, string>;
  Moderation?: ModerationSettings;
  Reactions?: Record<Snowflake, {
    e: string[];
    f: string;
  }>;
  premium?: number;
}

export type PartialGuild = DeepPartial<Guild>
export type RequiredGuild = DeepRequired<Guild>
