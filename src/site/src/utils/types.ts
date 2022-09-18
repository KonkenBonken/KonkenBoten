export * from '../../../../types/context';

export interface SelectOptions {
  options: {
    id?: string
    label: string
    icon?: string
  }[]
  onChoice?(id: string): void
  link?: string
  guildIcons?: boolean
}
