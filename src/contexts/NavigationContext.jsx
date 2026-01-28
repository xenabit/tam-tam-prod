import { createContext, useContext, useCallback } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const scrollToSection = useCallback((sectionId, duration = 1500) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`Секция с id "${sectionId}" не найдена`);
      return false;
    }

    const sections = ['intro', 'slider', 'storesFirst', 'carousel', 'channels', 'storesSecond', 'news', 'footer'];

    const sectionIndex = sections.indexOf(sectionId);
    if (sectionIndex === -1) return false;

    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return false;

    const sectionElements = scrollContainer.querySelectorAll('.section');
    if (!sectionElements[sectionIndex]) return false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const event = new CustomEvent('sectionChange', {
              detail: { sectionId },
            });
            window.dispatchEvent(event);
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.8,
      }
    );

    observer.observe(sectionElements[sectionIndex]);

    sectionElements[sectionIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    setTimeout(() => {
      observer.disconnect();
    }, duration);

    window.history.pushState(null, '', `#${sectionId}`);

    return true;
  }, []);

  const handleNavigation = useCallback(
    (e, navigate, location) => {
      e.preventDefault();

      const href = e.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const sectionId = href.substring(1);

      // if (location.pathname !== '/') {
      //   navigate(`/#${sectionId}`);

      if (location.pathname !== '/tam-tam-prod/') {
        navigate(`/#${sectionId}`);

        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
        return;
      }

      scrollToSection(sectionId);
    },
    [scrollToSection]
  );

  const value = {
    scrollToSection,
    handleNavigation,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export const useNavigation = () => useContext(NavigationContext);
