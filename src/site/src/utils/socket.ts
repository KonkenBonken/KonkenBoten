import { io } from "socket.io-client";

export const socket = io({
  autoConnect: false
});

export function connect(userId: string) {
  if (socket.connected) return;
  socket.io.opts.query = { userId };
  socket.connect();
  return new Promise(resolve => socket.once("connect", resolve))
}
