/**
 * MSW Entry Point
 * Exports appropriate mock setup based on environment
 */

export { handlers } from './handlers';

// Export browser worker for web environments
export { worker } from './browser';

// Export server for Node.js environments  
export { server } from './server';
