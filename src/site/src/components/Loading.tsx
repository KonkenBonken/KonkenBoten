import { Suspense, lazy as ReactLazy } from 'react';
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

export function lazy(importing, hideAnimation = false) {
  const LazyComponent = ReactLazy(importing);
  return (props = {}) => (<Await element={<LazyComponent {...props} />} hideAnimation={hideAnimation} />);
}
