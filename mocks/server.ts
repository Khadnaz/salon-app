/**
 * MSW Server Setup
 * For Node.js environments (tests, SSR, etc.)
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for Node.js
export const server = setupServer(...handlers);

// Start server
if (process.env.NODE_ENV === 'test') {
  server.listen({
    onUnhandledRequest: 'bypass',
  });
  console.log('🎭 MSW: Server started (Node.js mode)');
}
