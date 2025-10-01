/**
 * Mock Setup - Auto-detects environment and initializes appropriate mocking
 */

import { Platform } from 'react-native';

export async function initializeMocks() {
  // Check if running on web
  if (Platform.OS === 'web') {
    console.log('🌐 Running on Web - Attempting to initialize MSW...');
    try {
      const { worker } = await import('./browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
      console.log('✅ MSW Service Worker started (Web mode)');
      return 'msw';
    } catch (error) {
      console.warn('⚠️ Failed to start MSW, falling back to mock service');
      console.error(error);
      return 'mock-service';
    }
  } else {
    // React Native (iOS/Android)
    console.log('📱 Running on React Native - Using mock service');
    const { nativeMockServer } = await import('./native');
    nativeMockServer.start();
    return 'native-mock';
  }
}

// Auto-initialize in development
if (__DEV__) {
  initializeMocks();
}
