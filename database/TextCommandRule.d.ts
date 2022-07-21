import { Snowflake } from './Utils';

interface BaseTextCommandRule {
  command: string;
  /** @deprecated */ roles?: Snowflake[];
  embed?: boolean;
  disabled?: boolean;
}

interface ContentTextCommandRule extends BaseTextCommandRule {
  embed?: false;
  content: string;
}

interface EmbedTextCommandRule extends BaseTextCommandRule {
  embed: true;
  content: {
    athr: {
      img: string;
      nm: string;
    }
    ttl: string;
    desc: string;
    clr: string;
    thmb: string;
    img: string;
    ftr: {
      img: string;
      nm: string;
    }
  };
}
export type TextCommandRule = ContentTextCommandRule | EmbedTextCommandRule
