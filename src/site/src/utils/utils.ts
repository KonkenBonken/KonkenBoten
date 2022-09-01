import { useMediaQuery } from 'react-responsive';

export function titleCase(string: string) {
  return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
}

export const isMobile = () => useMediaQuery({ query: '(max-aspect-ratio: 3/4)' });
