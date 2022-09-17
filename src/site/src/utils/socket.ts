import { io } from "socket.io-client";
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

export function saveChanges() {
  return new Promise((resolve, reject) =>
    socket.emit('changes', { changes }, (res, err) => {
      if (err) return reject(console.error('Could not set changes', { err }));
      clearChanges();
      resolve();
    }))
}
