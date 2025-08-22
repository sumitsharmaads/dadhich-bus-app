import 'express-serve-static-core';
import type { Server as SocketIOServer } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
    io?: SocketIOServer;
  }
}
