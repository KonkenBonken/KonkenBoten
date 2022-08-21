import { ContextProps } from '../utils/context';

export default function ChangesPopup({ changes }: ContextProps) {

  return (<section id="changes-popup">
    You have {changes.length} unsaved change{changes.length > 1 && 's'}
  </section>);
}
