import { Snowflake, BaseDB } from './Utils';

import { TextCommandRule } from './TextCommandRule';
import { VoiceCommandRule } from './VoiceCommandRule';
import { TicketSettings } from './TicketSettings';

export class Guild extends BaseDB {
  /** @deprecated  */  prefix?: string;
  TextCommandRules?: TextCommandRule[];
  VoiceRules?: VoiceCommandRule[];
  Tickets?: TicketSettings;
  premium?: number;
  constructor(data: object) {
    super(data);
    this.VoiceRules = this.VoiceRules.map(rule => new VoiceCommandRule(rule));
    this.Tickets = new TicketSettings(this.VoiceRules);
  }
};
