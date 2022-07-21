import { Snowflake, BaseDB } from './Utils';

export class VoiceCommandRule extends BaseDB {
  channel: string;
  Userlimit?: number; //Bug: may be string
  channelname: string;
  disabled?: boolean;

  constructor(data: object) { super(data) }
}
