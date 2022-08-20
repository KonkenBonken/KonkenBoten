import { Suspense } from 'react';
import { lazyWithPreload } from "react-lazy-with-preload";
import { ReactComponent as LogoClip } from "../assets/logo-clip.svg";

const letters = ['a', 'b', 'c', 'd'] as const;

export function Loading() {
  return (
    <div className="loading" style={{
      clipPath: "url('#loading-clip-path')"
    }}>
      {letters.map(letter => (
        <div id={letter} key={letter} />
      ))}
      <LogoClip />
    </div>
  );
}

export function Await({ element, hideAnimation = false }) {
  return (<Suspense fallback={hideAnimation ? null : <Loading />}>
    {element}
  </Suspense>)
}

export function lazy(importing, preload = false, hideAnimation = false) {
  const Preloadable = lazyWithPreload(importing);
  if (preload)
    setTimeout(() => Preloadable.preload(), 2000);
  return (props = {}) => (<Await element={<Preloadable {...props} />} hideAnimation={hideAnimation} />);
}
