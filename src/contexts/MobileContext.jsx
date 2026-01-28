import { createContext, useContext, useState, useEffect } from 'react';

const MobileContext = createContext();
export function MobileProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: 768px)`);
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>;
}

//  Хук для получения состояния isMobile (true, если ширина экрана <= 768px).
//  Используйте внутри компонентов, обёрнутых в MobileProvider.

export function useMobile() {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}
