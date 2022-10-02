export * from '../../../../types/context';
export * from '../../../../types/guild';
export interface SelectOptionsItem {
  id?: string
  label: string
  icon?: string
  color?: string
}
export interface SelectOptionsItemWithId extends SelectOptionsItem {
  id: string;
}
export interface SelectOptions {
  options: SelectOptionsItem[]
  onChoice?(id: string): void
  link?: string
}
