import { useState, useMemo } from 'react';

const sizes = [640, 800, 1024, 1280, 1440, 1600, 1920, 2560, 3840, 7680],
  bgQueries = ['city', 'street', 'abstract', 'wall', 'nature', 'forest'];

if (!sizes.includes(window.screen.availWidth))
  sizes.push(window.screen.availWidth);

export function BackgroundImage() {
  const mountTime = useMemo(Date.now, []),
    [styles, setStyles] = useState({ opacity: 0 }),
    aspectRatio = window.screen.availHeight / window.screen.availWidth,
    url = (w: number) => `https://source.unsplash.com/featured/${w}x${Math.floor(w * aspectRatio)}/daily?${bgQueries}`,
    src = (w: number) => `${url(w)} ${w}w`;

  function onLoad() {
    if (Date.now() < mountTime + 300)
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
