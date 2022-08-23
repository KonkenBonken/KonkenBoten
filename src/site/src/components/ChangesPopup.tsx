import { ContextProps } from '../utils/context';
import { saveChanges } from '../utils/socket.ts';

export default function ChangesPopup({ changes }: ContextProps) {

  return (<section id="changes-popup">
    You have {changes.length} unsaved change{changes.length > 1 && 's'}
    <button onClick={saveChanges}>Save</button>
  </section>);
}
