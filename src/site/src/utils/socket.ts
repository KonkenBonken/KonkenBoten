import { io } from "socket.io-client";

if (!contextData.user)
  export const socket = undefined;
else
  export const socket = io({
    query: { userId: contextData.user.id }
  });
