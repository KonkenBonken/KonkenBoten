import { Snowflake } from './Utils';

export interface SuggestionSettings {
  enabled: boolean;
  embed: {
    suggestion: string;
    reasonFrom: string;
    approve: string;
    deny: string;
    consider: string;
    up: string;
    down: string;
    colors: {
      pending: string;
      approve: string;
      deny: string;
      consider: string;
    };
  };
  channels: {
    suggest: Snowflake;
    response: Snowflake;
  };
  staff: Snowflake;
  suggestions: Record<number, {
    user: Snowflake;
    msg: Snowflake;
    suggestion: string;
    answer?: {
      type: 'approve' | 'consider' | 'deny';
      user: Snowflake;
      reason?: string;
    }
  }>;
  index: number;
}
