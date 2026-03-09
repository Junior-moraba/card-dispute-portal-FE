import { useCallback } from 'react';
import { logger } from '../services/logger';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    logger.info(`User Event: ${eventName}`, {
      event: eventName,
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const trackPageView = useCallback((pageName: string) => {
    logger.info('Page View', {
      page: pageName,
      referrer: document.referrer,
    });
  }, []);

  return { trackEvent, trackPageView };
};
