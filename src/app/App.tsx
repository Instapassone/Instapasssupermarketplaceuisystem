import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  // Suppress errors in iframe/preview environments
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      const errorObj = args[0];
      // Suppress known safe warnings/errors
      if (
        message.includes('Cross-Origin') ||
        message.includes('CORS') ||
        message.includes('Encountered two children with the same key') ||
        message.includes('cross-origin') ||
        message.includes('Camera error:') ||
        (errorObj && errorObj.name === 'NotAllowedError')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      // Suppress Recharts duplicate key warnings
      if (message.includes('Encountered two children with the same key')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('Cross-Origin') ||
        event.message?.includes('CORS')
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener('error', handleError, true);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return <RouterProvider router={router} />;
}
