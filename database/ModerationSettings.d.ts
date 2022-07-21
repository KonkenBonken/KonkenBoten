import { Snowflake, EncodedT } from './Utils';

export interface ModerationSettings {
  color?: string;
  text: {
    hasBeen: string;
    by: string;
    reason: string;
    duration: string;
    messageFrom: string;
    until: string;
    color: string;
  };
  channel: Snowflake;
  staff: Snowflake;
  enabled?: 1;
  banMessage?: 1;
  logs: Record<Snowflake, {
    t: 'warn' | 'kick' | 'ban' | 'unban' | 'mute' | 'unmute';
    r?: string;
    m: Snowflake;
    d: EncodedT
  }[]>;
  tellWho?: 1;
  coms: Record<
  'warn' | 'kick' | 'ban' | 'tempban' | 'unban' | 'mute' | 'tempmute' | 'unmute',
  {
    txt: string;
    /** @deprecated */ role: Snowflake;
  }
  >;
  dmInvite?: 1;
  timeout?: 1;
}
