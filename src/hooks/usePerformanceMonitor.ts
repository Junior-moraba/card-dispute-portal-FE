import { useEffect } from 'react';
import { logger } from '../services/logger';

export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      if (duration > 1000) { // Log if component took > 1s
        logger.warn('Slow Component Render', {
          component: componentName,
          duration: `${duration.toFixed(2)}ms`,
        });
      }
    };
  }, [componentName]);
};
