import { useState, useMemo, CSSProperties } from 'react';

let sizes = [
  [document.body.clientWidth, document.body.clientHeight],
  [screen.availWidth, screen.availHeight]
],
  bgQueries = ['city', 'street', 'abstract', 'forest'];

if (sizes[0][0] == sizes[1][0])
  sizes = [];

export function BackgroundImage() {
  const mountTime = useMemo(Date.now, []),
    [styles, setStyles] = useState<CSSProperties>({ opacity: 0 }),
    url = ([w, h]: number[]) => `https://source.unsplash.com/featured/${w}x${h}/daily?${bgQueries}`,
    src = (size: number[]) => `${url(size)} ${size[0]}w`;

  function onLoad() {
    if (Date.now() < mountTime + 300 || 'transition' in styles)
      setStyles({})
    else
      setStyles({
        transition: 'opacity ease-in 1s'
      })
  }

  return (<img
    src={url(sizes[0])}
    srcSet={sizes.map(src).join()}
    style={styles}
    onLoad={onLoad}
  />);
}
