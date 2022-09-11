import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export function titleCase(string: string) {
  return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
}

export function useForceRerender() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export const isMobile = () => useMediaQuery({ maxAspectRatio: '3/5' });
