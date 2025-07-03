// Route preloader for improved navigation performance
import { lazy } from 'react';

// Critical routes that should be preloaded
const criticalRoutes = [
  'Index',
  'Auth',
  'Submit',
  'Ideas',
] as const;

// Lazy imports for preloading
const routeImports = {
  Index: () => import('@/pages/Index'),
  Auth: () => import('@/pages/Auth'),
  Submit: () => import('@/pages/Submit'),
  Ideas: () => import('@/pages/Ideas'),
  Explore: () => import('@/pages/Explore'),
  Create: () => import('@/pages/Create'),
  MyWorkspace: () => import('@/pages/MyWorkspace'),
  Community: () => import('@/pages/Community'),
  Profile: () => import('@/pages/Profile'),
  Admin: () => import('@/pages/Admin'),
  Builder: () => import('@/pages/Builder'),
  Remix: () => import('@/pages/Remix'),
  SubmissionComplete: () => import('@/pages/SubmissionComplete'),
} as const;

// Track preloaded routes
const preloadedRoutes = new Set<string>();

/**
 * Preload a specific route
 */
export const preloadRoute = (routeName: keyof typeof routeImports): Promise<any> => {
  if (preloadedRoutes.has(routeName)) {
    return Promise.resolve();
  }

  preloadedRoutes.add(routeName);
  return routeImports[routeName]().catch((error) => {
    console.warn(`Failed to preload route ${routeName}:`, error);
    preloadedRoutes.delete(routeName);
  });
};

/**
 * Preload critical routes after initial page load
 */
export const preloadCriticalRoutes = (): void => {
  // Wait for page to be fully loaded before preloading
  if (document.readyState === 'complete') {
    startPreloading();
  } else {
    window.addEventListener('load', startPreloading, { once: true });
  }
};

/**
 * Start preloading critical routes with delay
 */
const startPreloading = (): void => {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  };

  schedulePreload(() => {
    criticalRoutes.forEach((route) => {
      preloadRoute(route);
    });
  });
};

/**
 * Preload route on hover/focus (for navigation links)
 */
export const createPreloadHandler = (routeName: keyof typeof routeImports) => {
  let timeoutId: NodeJS.Timeout;
  
  return {
    onMouseEnter: () => {
      timeoutId = setTimeout(() => preloadRoute(routeName), 100);
    },
    onMouseLeave: () => {
      clearTimeout(timeoutId);
    },
    onFocus: () => {
      timeoutId = setTimeout(() => preloadRoute(routeName), 100);
    },
    onBlur: () => {
      clearTimeout(timeoutId);
    },
  };
};

// Initialize preloading
preloadCriticalRoutes();