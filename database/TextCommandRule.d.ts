
interface ContentTextCommandRule {
  command: string;
  content: string;
  /** @deprecated  */
  roles?: Snowflake[];
  embed?: false;
  disabled?: boolean;
}
interface EmbedTextCommandRule extends ContentTextCommandRule {
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
  }
}
export type TextCommandRule = ContentTextCommandRule | EmbedTextCommandRule
