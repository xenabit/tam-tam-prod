import { createContext, useContext, useState, useEffect } from 'react';

const OrientationContext = createContext();

export function OrientationProvider({ children }) {
  const [isPortrait, setIsPortrait] = useState(window.innerWidth <= window.innerHeight);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerWidth <= window.innerHeight);
    };

    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkOrientation, 50); // Более быстрый отклик
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return <OrientationContext.Provider value={isPortrait}>{children}</OrientationContext.Provider>;
}

export function useOrientation() {
  const context = useContext(OrientationContext);
  if (context === undefined) {
    throw new Error('useOrientation must be used within an OrientationProvider');
  }
  return context;
}
