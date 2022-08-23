import { useState } from 'react';

import { ContextProps } from '../utils/context';
import { saveChanges } from '../utils/socket.ts';

export default function ChangesPopup({ changes }: ContextProps) {
  const [loading, setLoading] = useState(false);

  function onClick() {
    setLoading(true);
    saveChanges()
      .then(() => setLoading(false));
  }

  return (<section id="changes-popup">
    You have {changes.length} unsaved change{changes.length > 1 && 's'}
    <button onClick={onClick} className={loading && 'loading'}>Save</button>
  </section>);
}
