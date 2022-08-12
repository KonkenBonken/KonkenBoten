import { ContextProps } from '../utils/context';

export default function SupportChannelSettings({ context: { guild: { database } } }: ContextProps) {
  return (<section>
    <pre>{JSON.stringify(database.Tickets, null, 2)}</pre>
  </section>)
}
