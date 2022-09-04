import { useState } from 'react';

export default function Toggle({ toggled = false, onoff }: { onoff: [string, string] }) {
  const [checked, setChecked] = useState(toggled)

  return <label className={`toggle ${checked ? 'checked' : ''}`}>
    <input type="checkbox"
      checked={checked}
      onChange={({ target }) => setChecked(target.checked)}
    />
    <div />
  </label>
}
