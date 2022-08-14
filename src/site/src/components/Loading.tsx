import { Suspense } from 'react';
import { lazyWithPreload } from "react-lazy-with-preload";
import { ReactComponent as LogoClip } from "../assets/logo-clip.svg";

export function Loading() {
  return (
    <div className="loading" style={{
      clipPath: "url('#loading-clip-path')"
    }}>
      {'abcd'.split('').map(letter => (
        <div id={letter} key={letter} />
      ))}
      <LogoClip />
    </div>
  );
}

export function Await({ element }) {
  return (<Suspense fallback={<Loading />}>
    {element}
  </Suspense>)
}

export function lazy(importing, preload = false) {
  const Preloadable = lazyWithPreload(importing);
  if (preload)
    setTimeout(() => Preloadable.preload(), 2000);
  return (props = {}) => (<Await element={<Preloadable {...props} />} />);
}
