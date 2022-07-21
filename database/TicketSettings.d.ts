import { Snowflake, EncodedT } from './Utils';

enum TicketSaveMode {
  always = 'always',
  ask = 'ask',
  never = 'never'
}

interface TicketTranscript {
  id: number;
  channelName: string,
  closedBy: Snowflake,
  msgs?: {
    a: Snowflake, c?: string | {
      athr?: string,
      ttl?: string,
      desc?: string,
      ftr?: string
    }, t: EncodedT, f?: [string, string]
  }[],
  closeAt: EncodedT,
  fromto: [EncodedT, EncodedT]
}

export interface TicketSettings {
  enabled?: boolean;
  channel: Snowflake;
  staff: Snowflake;
  author: string;
  emoji: string;
  color: string;
  existingMessage: Snowflake;
  /** @deprecated  */ticketsCreated: Snowflake[];
  parent: string;
  name: string;
  transcripts: TicketTranscript[]
  save: TicketSaveMode;
  unlisted?: 1;
  content: string;
}
