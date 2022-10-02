import React, { useState } from 'react';

import { useChanges } from '../hooks/Changes.ts';
import { useForceRerender } from '../hooks/ForceRerender.ts';
import { saveChanges } from '../utils/socket.ts';

export default function ChangesPopup() {
  const [loading, setLoading] = useState(false),
    [changes, addChange] = useChanges(useForceRerender());


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
