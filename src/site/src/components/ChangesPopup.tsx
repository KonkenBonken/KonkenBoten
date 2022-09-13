import { useState } from 'react';

import { ContextProps } from '../utils/types';
import { saveChanges } from '../utils/socket.ts';
import { useForceRerender } from '../utils/utils.ts';

let forceRerender: () => void;
window.addEventListener('rerenderChanges', () => forceRerender && forceRerender());

export default function ChangesPopup({ changes }: ContextProps) {
  const [loading, setLoading] = useState(false);

  forceRerender = useForceRerender();

  function onClick() {
    setLoading(true);
    saveChanges()
      .then(() => setLoading(false));
  }

  return !!changes.length && <section id="changes-popup">
    You have {changes.length} unsaved change{changes.length > 1 && 's'}
    <button onClick={onClick} className={loading && 'loading'}>Save</button>
  </section>;
}
