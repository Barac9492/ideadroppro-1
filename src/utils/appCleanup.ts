
import { subscriptionManager } from './subscriptionManager';

// Global cleanup function
export const cleanupApp = () => {
  console.log('Performing app-wide cleanup...');
  subscriptionManager.cleanupAll();
};

// Set up periodic cleanup of stale subscriptions
if (typeof window !== 'undefined') {
  // Clean up stale subscriptions every 2 minutes
  setInterval(() => {
    subscriptionManager.cleanupStale();
  }, 2 * 60 * 1000);

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanupApp);
  window.addEventListener('unload', cleanupApp);
}
