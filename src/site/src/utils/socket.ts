import { io } from "socket.io-client";
import { ContextProps } from '../utils/context';
import { PartialGuild } from '../../../../types/guild';

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
const contextResolverPromise: Promise<[ContextProps["setContext"], (changes: PartialGuild[]) => void]> = new Promise(resolve => contextResolver = resolve),
  setContext = contextResolverPromise.then(resolved => resolved[0]),
  setChanges = contextResolverPromise.then(resolved => resolved[1]);
export { contextResolver };

const changes: PartialGuild[] = [];

function updateChanges() {
  setChanges.then(set => set(changes));
}

/** proposeChange({ commands: { mute: 'mjuta' } }) */
export function proposeChange(change: PartialGuild) {
  changes.push(change);
  updateChanges();
}

export function saveChanges() {
  return new Promise((resolve, reject) =>
    socket.emit('changes', { changes }, (res, err) => {
      if (err) return reject(console.error('Could not set changes', { err }));
      changes.length = 0;
      updateChanges();
      resolve();
    }))
}
