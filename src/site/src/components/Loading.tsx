import { Suspense } from 'react';
import { lazyWithPreload } from "react-lazy-with-preload";

export function Loading() {
  return (
    <div className="loading" >
      <div id="a" />
      <div id="b" />
      <div id="c" />
      <div id="d" />
      <div id="e" />
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
