import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSection } from '../../contexts/SectionContext';
import { useMobile } from '../../contexts/MobileContext';
import { gsap } from 'gsap';
import './SliderCharacters.scss';

const SliderCharacters = ({ id, isActive }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1600,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });
  const isMobile = useMobile();
  const [currentColors, setCurrentColors] = useState({
    animalBg: '#80dcb0',
    nameBg: '#2ea56c',
  });

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const itemsRef = useRef([]);
  const animationTimelineRef = useRef(null);
  const starsExplosionRefs = useRef([]);
  const frontImagesRef = useRef([]);
  const { updateSliderlSlide } = useSection();
  const containerInnerRef = useRef(null);
  const hasInitialized = useRef(false);
  const positionsInitialized = useRef(false);
  const isInitializing = useRef(false);
  const currentProgressRef = useRef(0);
  const wasActive = useRef(false);
  const isDeactivating = useRef(false);
  const deactivationTimeoutRef = useRef(null);

  const slideConfig = useMemo(
    () => [
      {
        background: '#39C883',
        fill: '#2EA56C',
        outline: '#FCCD67',
        backgroundBox: '#80dcb0',
        backgroundName: '#2ea56c',
      },
      {
        background: '#5b71c1',
        fill: '#5b71c1',
        outline: '#ffd26e',
        backgroundBox: '#b7c6f4',
        backgroundName: '#849adc',
      },
      {
        background: '#ea437b',
        fill: '#c41650',
        outline: '#f49cba',
        backgroundBox: '#f49cba',
        backgroundName: '#c41650',
      },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleFactor = useMemo(() => {
    const width = windowSize.width;
    const baseWidth = 1600;
    const minScale = 1;

    const scale = (width / baseWidth) * minScale;

    return Math.max(minScale, scale);
  }, [windowSize.width]);

  useEffect(() => {
    console.log(`Ширина: ${windowSize.width}px, Scale factor: ${scaleFactor}`);
  }, [windowSize.width, scaleFactor]);

  const getInitialClass = useCallback((index) => {
    if (index === 7) return 'center';
    if (index > 6 || index === 0) return 'next';
    return 'prev';
  }, []);

  const animateSpringJump = useCallback(
    (index) => {
      if (!isActive) return;

      const frontImage = frontImagesRef.current[index];
      if (!frontImage) return;

      gsap.killTweensOf(frontImage);
      gsap.fromTo(
        frontImage,
        { scale: 1 },
        {
          scale: 1.1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
          delay: 0,
        }
      );
    },
    [isActive]
  );

  const createStarsExplosion = useCallback(
    (index) => {
      if (!isActive) return;

      const container = starsExplosionRefs.current[index];
      if (!container) return;

      container.innerHTML = '';
      const starCount = 24;
      const minDistance = isMobile ? 100 : 100 * scaleFactor;
      const maxDistance = isMobile ? 600 : 600 * scaleFactor;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));

      const masterTimeline = gsap.timeline({
        onComplete: () => {
          container.innerHTML = '';
        },
      });

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'SliderCharacters__star-particle';

        const isLargeStar = i % 2 === 0;
        const baseSize = isLargeStar ? (isMobile ? 52 : 52 * scaleFactor) : isMobile ? 17 : 17 * scaleFactor;
        const angle = i * goldenAngle;
        const normalizedIndex = i / starCount;
        const distance = minDistance + normalizedIndex * (maxDistance - minDistance);
        const duration = 0.6 + Math.random() * 0.4;

        star.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${baseSize}px;
        height: ${baseSize}px;
        margin-left: -${baseSize / 2}px;
        margin-top: -${baseSize / 2}px;
        opacity: 0;
        transform: scale(0.3);
        will-change: transform, opacity;
        filter: drop-shadow(0 0 20px #ffbe2d) drop-shadow(0 0 80px #ffbe2d);
        pointer-events: none;
        z-index: 1000;
      `;

        container.appendChild(star);
        const finalDistance = distance + (Math.random() - 0.5) * (distance * 0.3);
        const endX = Math.cos(angle) * finalDistance;
        const endY = Math.sin(angle) * finalDistance;

        const starTimeline = gsap.timeline({ defaults: { ease: 'linear' } });

        starTimeline
          .to(star, {
            opacity: 1,
            scale: isLargeStar ? 1.1 : 1.4,
            x: endX * 0.5,
            y: endY * 0.5,
            duration: duration * 0.2,
          })
          .to(
            star,
            {
              opacity: 0.8,
              scale: isLargeStar ? 1 : 1.2,
              x: endX * 0.7,
              y: endY * 0.7,
              duration: duration * 0.4,
            },
            '0'
          )
          .to(star, {
            opacity: 0,
            scale: 0,
            x: endX,
            y: endY,
            duration: duration * 0.4,
          });

        masterTimeline.add(starTimeline, 0);
      }

      const cleanupTimer = setTimeout(() => {
        if (container) container.innerHTML = '';
      }, 3000);

      return () => {
        masterTimeline.kill();
        clearTimeout(cleanupTimer);
        if (container) container.innerHTML = '';
      };
    },
    [isActive]
  );

  const createImageConfig = useCallback(
    (id, prefix = 'slider-character') => ({
      id,
      name: ['Бони', 'Барсик', 'Лили'][(id - 1) % 3],
      image: {
        front: {
          img: new URL(`/src/assets/images/${prefix}-front-${id}.png`, import.meta.url).href,
          avif: new URL(`/src/assets/images/${prefix}-front-${id}.avif`, import.meta.url).href,
          webp: new URL(`/src/assets/images/${prefix}-front-${id}.webp`, import.meta.url).href,
        },
        rotated: {
          img: new URL(`/src/assets/images/${prefix}-rotated-${id}.png`, import.meta.url).href,
          avif: new URL(`/src/assets/images/${prefix}-rotated-${id}.avif`, import.meta.url).href,
          webp: new URL(`/src/assets/images/${prefix}-rotated-${id}.webp`, import.meta.url).href,
        },
      },
      alt: `Character ${id}`,
    }),
    []
  );

  const characters = useMemo(() => {
    const baseCharacters = [1, 2, 3].map((id) => createImageConfig(id));
    const extendedCharacters = [
      ...baseCharacters.map((char, idx) => ({ ...char, id: idx + 1 })),
      ...baseCharacters.map((char, idx) => ({ ...char, id: idx + 4 })),
      ...baseCharacters.map((char, idx) => ({ ...char, id: idx + 7 })),
    ];

    return extendedCharacters.map((char, index) => ({
      ...char,
      initialClass: getInitialClass(index),
    }));
  }, [createImageConfig, getInitialClass]);

  const parabolaConfig = useMemo(() => {
    const baseConfig = {
      radius: 700,
      amplitude: 90,
      spacing: 390,
      visibleCount: 8,
      rotate: 16,
    };

    if (isMobile) {
      return {
        radius: 600,
        amplitude: 90,
        spacing: 330,
        visibleCount: 8,
        rotate: 10,
      };
    }

    return {
      radius: baseConfig.radius * scaleFactor,
      amplitude: baseConfig.amplitude * scaleFactor,
      spacing: baseConfig.spacing * scaleFactor * 1.05,
      visibleCount: baseConfig.visibleCount,
      rotate: baseConfig.rotate,
    };
  }, [isMobile, scaleFactor]);

  const calculateParabolaPosition = useCallback(
    (index, progress = 0) => {
      const totalItems = characters.length;

      const offsetIndex = (index - progress + totalItems) % totalItems;
      const position = offsetIndex - Math.floor(parabolaConfig.visibleCount / 2);
      const x = position * parabolaConfig.spacing;
      const y = (x * x) / (4 * parabolaConfig.radius) + parabolaConfig.amplitude;
      const rotation = position * parabolaConfig.rotate;
      const distanceFromCenter = Math.abs(position);

      return {
        x,
        y,
        rotation,
        zIndex: Math.round(100 - distanceFromCenter * 10),
      };
    },
    [characters.length, parabolaConfig]
  );

  const updateItemClasses = useCallback(
    (centerIndex = currentIndex, triggerEffects = false) => {
      if (!isActive) return;

      const totalItems = characters.length;
      const centerClassIndex = 4;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const previousClass = item.classList.contains('center');
        item.classList.remove('center', 'prev', 'next');

        let relativePosition = (index - centerIndex + totalItems) % totalItems;

        if (relativePosition === centerClassIndex) {
          item.classList.add('center');

          if (triggerEffects && (!previousClass || triggerEffects === 'force')) {
            createStarsExplosion(index);

            setTimeout(() => {});
            animateSpringJump(index);
          }
        } else if (relativePosition > centerClassIndex) {
          item.classList.add('next');
        } else {
          item.classList.add('prev');
        }
      });
    },
    [currentIndex, characters.length, createStarsExplosion, animateSpringJump, isActive]
  );

  const animateElementsColorChange = useCallback(
    (newConfig) => {
      if (!isActive) return;

      setCurrentColors({
        animalBg: newConfig.backgroundBox,
        nameBg: newConfig.backgroundName,
      });

      gsap.to(document.documentElement, {
        duration: 0.6,
        ease: 'linear',
        '--current-animal-bg': newConfig.backgroundBox,
        '--current-name-bg': newConfig.backgroundName,
      });
    },
    [isActive]
  );

  const updatePositions = useCallback(
    (progress = 0, immediate = false, skipAnimation = false) => {
      if (!isActive) return;

      if (progress !== undefined) {
        currentProgressRef.current = progress;
      }

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const position = calculateParabolaPosition(index, progress);

        if (immediate || skipAnimation) {
          gsap.set(item, {
            x: position.x,
            y: position.y,
            rotate: position.rotation,
            zIndex: position.zIndex,
          });
        } else {
          gsap.to(item, {
            duration: skipAnimation ? 0 : isMobile ? 0.5 : 1,
            ease: skipAnimation ? 'none' : 'linear',
            x: position.x,
            y: position.y,
            rotate: position.rotation,
            zIndex: position.zIndex,
            overwrite: true,
          });
        }
      });
    },
    [calculateParabolaPosition, isActive]
  );

  const introAnimation = useCallback(() => {
    if (!isActive || hasInitialized.current || !positionsInitialized.current || isInitializing.current) {
      return;
    }

    isInitializing.current = true;
    console.log('Запуск introAnimation для активного слайдера');

    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
    }

    setIsIntroPlaying(true);
    setIsSliding(true);

    updatePositions(0, true);

    const timeline = gsap.timeline({
      onStart: () => {
        console.log('Начало вступительной анимации');
        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          pointerEvents: 'auto',
        });

        gsap.to(containerInnerRef.current, {
          opacity: 1,
          duration: 1.5,
          ease: 'linear',
        });
      },
      onUpdate: () => {
        if (isActive) {
          updatePositions(currentProgressRef.current, false, true);
        }
      },
      onComplete: () => {
        console.log('Анимация прокрутки завершена');

        if (isActive) {
          updatePositions(3, true);

          gsap.delayedCall(0.1, () => {
            const newIndex = 3;

            updateItemClasses(newIndex, 'force');
            updateSliderlSlide(0);
            setCurrentIndex(newIndex);

            const initialConfig = slideConfig[0];
            animateElementsColorChange(initialConfig);

            gsap.delayedCall(0.1, () => {
              setIsIntroPlaying(false);
              setIsSliding(false);
              hasInitialized.current = true;
              isInitializing.current = false;
              console.log('Вступительная анимация полностью завершена');
            });
          });
        }
      },
    });

    gsap.set(containerInnerRef.current, { opacity: 0 });

    timeline.to(currentProgressRef, {
      current: 3,
      duration: isMobile ? 1 : 1.2,
      ease: 'power2.out',
      onUpdate: function () {
        if (isActive) {
          updatePositions(this.targets()[0].current, false, true);
        }
      },
    });

    animationTimelineRef.current = timeline;

    return () => {
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
      }
      isInitializing.current = false;
    };
  }, [isActive, slideConfig]);

  const animateBackgroundChange = useCallback(
    (newIndex, direction = 'down') => {
      if (!isActive || !backgroundRef.current) return;

      const nextSlideConfigIndex = newIndex % 3;
      const nextConfig = slideConfig[nextSlideConfigIndex];
      const backgroundElement = backgroundRef.current;

      backgroundElement.style.setProperty('--next-bg-color', nextConfig.background);
      backgroundElement.style.setProperty('--gradient-direction', direction === 'down' ? 'to bottom' : 'to top');
      backgroundElement.style.setProperty('--bg-progress', '0%');

      gsap.fromTo(
        backgroundElement,
        { '--bg-progress': '0%' },
        {
          '--bg-progress': '100%',
          duration: 0.6,
          ease: 'linear',
          onComplete: () => {
            if (backgroundElement && isActive) {
              backgroundElement.style.setProperty('--current-bg-color', nextConfig.background);
              backgroundElement.style.setProperty('--bg-progress', '0%');
            }
          },
        }
      );

      animateElementsColorChange(nextConfig);
    },
    [slideConfig, animateElementsColorChange, isActive]
  );

  const nextSlide = useCallback(() => {
    if (!isActive || isSliding || isIntroPlaying || !hasInitialized.current) return;

    setIsSliding(true);
    const newIndex = (currentIndex + 1) % characters.length;
    const slideConfigIndex = newIndex % 3;

    updatePositions(newIndex);
    animateBackgroundChange(slideConfigIndex, 'down');

    updateSliderlSlide(slideConfigIndex);

    gsap.delayedCall(isMobile ? 0.5 : 0.9, () => {
      if (isActive) {
        setCurrentIndex(newIndex);
        updateItemClasses(newIndex, true);
        setIsSliding(false);
      }
    });
  }, [isActive, isSliding, isIntroPlaying, currentIndex, characters.length, updatePositions, animateBackgroundChange, updateSliderlSlide, updateItemClasses, hasInitialized]);

  const prevSlide = useCallback(() => {
    if (!isActive || isSliding || isIntroPlaying || !hasInitialized.current) return;

    setIsSliding(true);
    const newIndex = (currentIndex - 1 + characters.length) % characters.length;
    const slideConfigIndex = newIndex % 3;

    updatePositions(newIndex);
    animateBackgroundChange(slideConfigIndex, 'up');

    gsap.delayedCall(isMobile ? 0.2 : 0.4, () => {
      if (isActive) {
        updateSliderlSlide(slideConfigIndex);
      }
    });

    gsap.delayedCall(isMobile ? 0.5 : 0.9, () => {
      if (isActive) {
        setCurrentIndex(newIndex);
        updateItemClasses(newIndex, true);
        setIsSliding(false);
      }
    });
  }, [isActive, isSliding, isIntroPlaying, currentIndex, characters.length, updatePositions, animateBackgroundChange, updateSliderlSlide, updateItemClasses, hasInitialized]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isActive || isIntroPlaying || isSliding || !hasInitialized.current) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    },
    [isActive, nextSlide, prevSlide, isIntroPlaying, isSliding, hasInitialized]
  );

  const handleButtonClick = useCallback(
    (e, direction) => {
      if (!isActive || isIntroPlaying || isSliding || !hasInitialized.current) {
        e.preventDefault();
        return;
      }

      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      if (direction === 'next') {
        nextSlide();
      } else {
        prevSlide();
      }
    },
    [isActive, isIntroPlaying, isSliding, nextSlide, prevSlide, hasInitialized]
  );

  const handleDrag = useCallback(() => {
    if (!isActive || isIntroPlaying || isSliding || !hasInitialized.current) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;
    const threshold = 50;
    const maxVerticalThreshold = 30;
    let startTime = 0;

    const handleStart = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
      startTime = Date.now();
      isDragging = false;
    };

    const handleMove = (clientX, clientY) => {
      if (!startX || Date.now() - startTime < 10) return;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (Math.abs(deltaY) > maxVerticalThreshold) {
        return;
      }

      if (Math.abs(deltaX) > threshold) {
        isDragging = true;

        if (deltaX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }

        startX = 0;
        startY = 0;
      }
    };

    const handleEnd = (clientX) => {
      const elapsed = Date.now() - startTime;
      const isTap = elapsed < 300 && Math.abs(clientX - startX) < 10;

      if (!isDragging && isTap) {
      }

      isDragging = false;
      startX = 0;
      startY = 0;
    };

    const handleMouseDown = (e) => {
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
      if (!isDragging && startX) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = (e) => {
      handleEnd(e.clientX);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && target.closest('.SliderCharacters__navigation')) {
        return;
      }

      handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1 || !startX) return;

      const touch = e.touches[0];

      if (Math.abs(touch.clientX - startX) > 10) {
        e.preventDefault();
      }

      handleMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length > 0) return;
      handleEnd(e.changedTouches[0].clientX);
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);

      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive, nextSlide, prevSlide, isIntroPlaying, isSliding, hasInitialized]);

  const startDeactivation = useCallback(() => {
    if (isDeactivating.current) return;

    isDeactivating.current = true;

    gsap.to(containerRef.current, {
      opacity: 0.3,
      duration: 1,
      ease: 'power2.out',
      pointerEvents: 'none',

      onComplete: () => {
        deactivationTimeoutRef.current = setTimeout(() => {
          resetComponentState();
          isDeactivating.current = false;
          wasActive.current = false;
        }, 300);
      },
    });

    setIsSliding(true);
  }, []);

  const resetComponentState = useCallback(() => {
    gsap.killTweensOf(itemsRef.current);
    gsap.killTweensOf(currentProgressRef);
    gsap.killTweensOf(backgroundRef.current);
    gsap.killTweensOf(containerInnerRef.current);
    if (animationTimelineRef.current) {
      animationTimelineRef.current.kill();
      animationTimelineRef.current = null;
    }
    starsExplosionRefs.current.forEach((container) => {
      if (container) container.innerHTML = '';
    });
    if (deactivationTimeoutRef.current) {
      clearTimeout(deactivationTimeoutRef.current);
      deactivationTimeoutRef.current = null;
    }
    setCurrentIndex(0);
    setIsSliding(false);
    setIsIntroPlaying(false);
    setCurrentColors({
      animalBg: '#80dcb0',
      nameBg: '#2ea56c',
    });
    hasInitialized.current = false;
    positionsInitialized.current = false;
    isInitializing.current = false;
    currentProgressRef.current = 0;
    isDeactivating.current = false;

    itemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.set(item, {
          x: 0,
          y: 0,
          rotate: 0,
          zIndex: 100,
          opacity: 1,
        });

        item.classList.remove('center', 'prev', 'next');
        item.classList.add(getInitialClass(index));
      }
    });

    if (containerInnerRef.current) {
      gsap.set(containerInnerRef.current, {
        opacity: 1,
        clearProps: 'all',
      });
    }
    if (containerRef.current) {
      gsap.set(containerRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        clearProps: 'all',
      });
    }
  }, []);

  useEffect(() => {
    if (isActive && hasInitialized.current) {
      updatePositions(currentProgressRef.current, false, true);
    }
  }, [windowSize.width, scaleFactor, isActive]);

  useEffect(() => {
    if (!positionsInitialized.current) {
      updatePositions(0, true);
      positionsInitialized.current = true;
    }

    if (isActive && !hasInitialized.current && !isInitializing.current) {
      if (deactivationTimeoutRef.current) {
        clearTimeout(deactivationTimeoutRef.current);
        deactivationTimeoutRef.current = null;
      }

      isDeactivating.current = false;
      introAnimation();
      wasActive.current = true;
    }

    if (!isActive && wasActive.current && !isDeactivating.current) {
      startDeactivation();
    }

    return () => {
      if (!isActive) {
        resetComponentState();
      }
    };
  }, [isActive, introAnimation, resetComponentState, startDeactivation]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cleanup = handleDrag();
    return cleanup;
  }, [handleDrag]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--current-animal-bg', currentColors.animalBg);
    document.documentElement.style.setProperty('--current-name-bg', currentColors.nameBg);
  }, [currentColors]);

  return (
    <div className="SliderCharacters" ref={containerRef} id={id} style={{ opacity: 0 }}>
      <div ref={backgroundRef} className="SliderCharacters__background" aria-hidden="true" />
      <div ref={containerInnerRef} className="SliderCharacters__container">
        {characters.map((character, index) => (
          <div
            key={`${character.id}-${index}`}
            ref={(el) => (itemsRef.current[index] = el)}
            className={`SliderCharacters__item ${character.initialClass}`}
            style={{
              position: 'absolute',
              cursor: isIntroPlaying || !isActive ? 'default' : 'grab',
              pointerEvents: isIntroPlaying || !isActive ? 'none' : 'auto',
            }}
          >
            <div ref={(el) => (starsExplosionRefs.current[index] = el)} className="SliderCharacters__stars-explosion" aria-hidden="true" />

            <div className="SliderCharacters__animal">
              <div className="SliderCharacters__pictures">
                <div className="SliderCharacters__front">
                  <picture>
                    <source type="image/avif" srcSet={character.image.front.avif} />
                    <source type="image/webp" srcSet={character.image.front.webp} />
                    <img
                      ref={(el) => (frontImagesRef.current[index] = el)}
                      src={character.image.front.img}
                      width="395"
                      height="395"
                      alt={character.name}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      style={{
                        transformOrigin: 'center bottom',
                        display: 'block',
                        width: '100%',
                        height: '110%',
                        objectFit: 'contain',
                        objectPosition: '0 100%',
                      }}
                    />
                  </picture>
                </div>
                <div className="SliderCharacters__rotated" aria-hidden="true">
                  <picture>
                    <source type="image/avif" srcSet={character.image.rotated.avif} />
                    <source type="image/webp" srcSet={character.image.rotated.webp} />
                    <img src={character.image.rotated.img} width="395" height="395" alt={character.alt} loading="lazy" decoding="async" draggable="false" />
                  </picture>
                </div>
              </div>
              <div className="SliderCharacters__name">{character.name}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="SliderCharacters__navigation"
        style={{
          opacity: isIntroPlaying || !isActive ? 0.3 : 1,
          pointerEvents: isIntroPlaying || !isActive || !hasInitialized.current ? 'none' : 'auto',
        }}
      >
        <button
          className="SliderCharacters__arrow SliderCharacters__arrow_prev"
          onClick={(e) => handleButtonClick(e, 'prev')}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Previous slide"
          disabled={isIntroPlaying || isSliding || !isActive || !hasInitialized.current}
          style={{ backgroundColor: currentColors.nameBg }}
        >
          ←
        </button>

        <button
          className="SliderCharacters__arrow SliderCharacters__arrow_next"
          onClick={(e) => handleButtonClick(e, 'next')}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Next slide"
          disabled={isIntroPlaying || isSliding || !isActive || !hasInitialized.current}
          style={{ backgroundColor: currentColors.nameBg }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default SliderCharacters;
