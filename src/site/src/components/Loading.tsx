import { Suspense } from 'react';

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
