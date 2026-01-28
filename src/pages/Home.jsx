// Home.jsx
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';
import { useSection } from '../contexts/SectionContext';
import { useNavigation } from '../contexts/NavigationContext';
import Loader from '../components/Loader/Loader';
import Intro from '../components/Intro/Intro';
import SliderCharacters from '../components/SliderCharacters/SliderCharacters';
import AppStoresFirst from '../components/AppStoresFirst/AppStoresFirst';
import AppStoresSecond from '../components/AppStoresSecond/AppStoresSecond';
import Channels from '../components/Channels/Channels';
import News from '../components/News/News';
import Carousel from '../components/Carousel/Carousel';
import Footer from '../components/Footer/Footer';

/**
 * Главная страница приложения, отображающая секции Intro, SliderCharacters и AppStoresFirst.
 * Управляет кастомной прокруткой
 */

export default function Home() {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const touchStartY = useRef(0);
  const isScrollLocked = useRef(false);
  const isWheelActive = useRef(false);
  const isInitialAnimation = useRef(true);
  const lastScrollTime = useRef(0);
  const { setCurrentSection, currentSection, sectionConfig, setIsIntroSection } = useSection();
  const { scrollToSection } = useNavigation();

  const sections = [
    { component: Intro, id: 'intro' },
    { component: SliderCharacters, id: 'slider' },
    { component: AppStoresFirst, id: 'storesFirst' },
    { component: Carousel, id: 'carousel' },
    { component: Channels, id: 'channels' },
    { component: AppStoresSecond, id: 'storesSecond' },
    { component: News, id: 'news' },
    { component: Footer, id: 'footer' },
  ];

  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);

      setTimeout(() => {
        scrollToSection(sectionId);
      }, 1000);
    }

    const handleHashChange = () => {
      if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        scrollToSection(sectionId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [scrollToSection]);

  useEffect(() => {
    const container = containerRef.current;
    const introConfig = sectionConfig.intro;

    const initialLockDuration = introConfig?.scrollLockDuration ?? 1500;

    /**
     * Прокручивает к секции по индексу.
     * @param {number} index - Индекс секции.
     */

    const initialTimer = setTimeout(() => {
      isInitialAnimation.current = false;
    }, initialLockDuration);

    const scrollToSection = (index) => {
      if (index < 0 || index >= sections.length) {
        isScrollLocked.current = false;
        isWheelActive.current = false;
        return;
      }

      const section = sectionRefs.current[index];
      const sectionId = sections[index].id;
      const sectionConfigItem = sectionConfig[sectionId];

      if (!section) {
        isScrollLocked.current = false;
        isWheelActive.current = false;
        return;
      }

      if (!isScrollLocked.current) {
        isScrollLocked.current = true;
        isWheelActive.current = true;

        try {
          section.scrollIntoView({ behavior: 'smooth' });
          setCurrentSection(sectionId);
          setIsIntroSection(sectionId === 'intro');

          const lockDuration = sectionConfigItem?.scrollLockDuration ?? 1500;
          const shouldLock = sectionConfigItem?.shouldLockScroll ?? true;

          if (shouldLock && lockDuration > 0) {
            setTimeout(() => {
              isScrollLocked.current = false;
              isWheelActive.current = false;
            }, lockDuration);
          } else {
            isScrollLocked.current = false;
            isWheelActive.current = false;
          }
        } catch (error) {
          isScrollLocked.current = false;
          isWheelActive.current = false;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollLocked.current) {
            const index = sectionRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setCurrentSection(sections[index].id);
              setIsIntroSection(sections[index].id === 'intro');
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.8,
      }
    );

    sectionRefs.current.forEach((section, index) => {
      if (section) observer.observe(section);
    });

    const handleWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (isInitialAnimation.current) return;
      if (isScrollLocked.current || isWheelActive.current || now - lastScrollTime.current < 300) return;

      isWheelActive.current = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      const currentIndex = sections.findIndex((s) => s.id === currentSection);
      scrollToSection(currentIndex + direction);
      lastScrollTime.current = now;
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (isInitialAnimation.current || isScrollLocked.current || now - lastScrollTime.current < 300) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 50) {
        const currentIndex = sections.findIndex((s) => s.id === currentSection);
        if (deltaY > 0) {
          scrollToSection(currentIndex + 1);
        } else if (deltaY < 0) {
          scrollToSection(currentIndex - 1);
        }
        lastScrollTime.current = now;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      clearTimeout(initialTimer);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [setCurrentSection, currentSection, setIsIntroSection]);

  return (
    <>
      <Helmet>
        <title>Тамагочи</title>
        <meta name="description" content="TamTam Мой милый питомец" />
        <meta name="keywords" content="Книга Перемен, И-Цзин, гадание онлайн, гексаграммы, китайская философия, канон перемен" />
        <meta property="og:title" content="TamTam Мой милый питомец" />
        <meta property="og:description" content="TamTam Мой милый питомец" />
        <meta property="og:url" content="https://xenabit.github.io/tam-tam-prod/" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'TamTam Мой милый питомец',
            description: 'TamTam Мой милый питомец',
            url: 'https://xenabit.github.io/tam-tam-prod/',
            image: '/preview-image.jpg',
            publisher: {
              '@type': 'Organization',
              name: 'LABA',
              logo: {
                '@type': 'ImageObject',
                url: 'https://xenabit.github.io/tam-tam-prod/logo-laba.svg',
              },
            },
          })}
        </script>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; img-src 'self' https://iching.laba-laba.ru https://mc.yandex.ru data:; script-src 'self' https://mc.yandex.ru 'sha256-GylAe+ymyzx4MREH3q81FRQ39P6rjlCCFoz0YjMxgVc='; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://mc.yandex.ru https://api.yourdomain.com; frame-src 'self' https://mc.yandex.ru;"
        />
      </Helmet>
      <main>
        <div className="scroll-container" ref={containerRef}>
          <Suspense fallback={<Loader />}>
            <AnimatePresence>
              {sections.map(({ component: Component, id }, index) => (
                <section key={id} className="section" tabIndex={0} ref={(el) => (sectionRefs.current[index] = el)} style={{ backgroundColor: sectionConfig[id]?.background || '#ffffff' }}>
                  <Component key={`${id}-${currentSection}`} id={id} isActive={currentSection === id} />
                </section>
              ))}
            </AnimatePresence>
          </Suspense>
        </div>
      </main>
    </>
  );
}
