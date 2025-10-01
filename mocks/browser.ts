/**
 * MSW Browser Setup
 * Note: This works for web browsers only, not React Native mobile apps
 * For web version of Expo app: npx expo start --web
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW service worker for browser
export const worker = setupWorker(...handlers);

// Start worker in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  }).then(() => {
    console.log('🎭 MSW: Service worker started (browser mode)');
  }).catch((error) => {
    console.error('🔴 MSW: Failed to start service worker:', error);
  });
}
