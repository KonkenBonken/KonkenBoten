import { io } from "socket.io-client";
import { ContextProps } from '../../../../types/context';
import { clearChanges, globalChanges as changes } from '../hooks/Changes.ts';

export const socket = io({
  autoConnect: false
});

export function connect(userId: string) {
  if (socket.connected) return;
  socket.io.opts.query = { userId };
  socket.connect();
  return new Promise(resolve => socket.once("connect", resolve))
}

let contextResolver: (context) => void;
const contextResolverPromise: Promise<[ContextProps["setContext"]]> = new Promise(resolve => contextResolver = resolve),
  setContext = contextResolverPromise.then(resolved => resolved[0]);
export { contextResolver };

export function saveChanges() {
  return new Promise((resolve, reject) =>
    socket.emit('changes', { changes }, (res, err) => {
      if (err) return reject(console.error('Could not set changes', { err }));
      clearChanges();
      resolve();
    }))
}
