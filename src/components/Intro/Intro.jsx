import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useMobile } from '../../contexts/MobileContext';
import { useOrientation } from '../../contexts/OrientationContext'; // Импорт нового контекста
import { useSection } from '../../contexts/SectionContext';
import { gsap } from 'gsap';
import styles from './Intro.module.scss';

import pet_1 from '/src/assets/images/pet-1.png';
import pet_1_avif from '/src/assets/images/pet-1.avif';
import pet_1_webp from '/src/assets/images/pet-1.webp';
import pet_2 from '/src/assets/images/pet-2.png';
import pet_2_avif from '/src/assets/images/pet-2.avif';
import pet_2_webp from '/src/assets/images/pet-2.webp';
import pet_3 from '/src/assets/images/pet-3.png';
import pet_3_avif from '/src/assets/images/pet-3.avif';
import pet_3_webp from '/src/assets/images/pet-3.webp';

function Intro({ id, isActive }) {
  const isMobile = useMobile();
  const isPortrait = useOrientation(); // Получаем ориентацию
  const { triggerAnimalChange } = useSection();

  // Определяем режим отображения
  const displayMode = useMemo(() => {
    // Если мобилка ИЛИ вертикальная ориентация на десктопе
    if (isMobile || isPortrait) {
      return 'mobile';
    }
    return 'desktop';
  }, [isMobile, isPortrait]);

  const animalChangeTriggeredRef = useRef(false);
  const [animalIndices, setAnimalIndices] = useState([0, 1]);
  const leftAnimalRef = useRef(null);
  const rightAnimalRef = useRef(null);
  const timelineRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isFirstCycleRef = useRef(true);

  const ANIMATION_CONFIG = {
    CENTER_PAUSE_DURATION: 2,
    INITIAL_DELAY: 0.8,
    CYCLE_PAUSE: 0.5,
    ENTRY_DURATION: 1.0,
    EXIT_DURATION: 0.5,
    ENTRY_EASE: 'elastic.out(1, 1)',
    EXIT_EASE: 'power2.in',
  };

  const ANIMALS_DATA = [
    {
      img: {
        img: pet_1,
        avif: pet_1_avif,
        webp: pet_1_webp,
        alt: 'TamTam Ягнёнок',
      },
      baseWidth: {
        desktop: '54vw',
        mobile: '92vw',
      },
      positions: {
        desktop: {
          left: {
            x: '-38vw',
            y: '23vh',
            rotate: 17,
          },
          right: {
            x: '38vw',
            y: '31vh',
            rotate: -16,
            width: '49vw',
          },
        },
        mobile: {
          left: {
            x: '-35vw',
            y: '35vh',
            rotate: 21,
          },
          right: {
            x: '46vw',
            y: '-14vh',
            rotate: -45,
          },
        },
      },
    },
    {
      img: {
        img: pet_3,
        avif: pet_3_avif,
        webp: pet_3_webp,
        alt: 'TamTam Котёнок',
      },
      baseWidth: {
        desktop: '58vw',
        mobile: '97vw',
      },
      positions: {
        desktop: {
          left: {
            x: '-35vw',
            y: '39vh',
            rotate: 9,
            width: '54vw',
          },
          right: {
            x: '40vw',
            y: '35vh',
            rotate: -20,
            width: '55vw',
          },
        },
        mobile: {
          left: {
            x: '-32vw',
            y: '39vh',
            rotate: 19,
            width: '102vw',
          },
          right: {
            x: '44vw',
            y: '-16vh',
            rotate: -38,
          },
        },
      },
    },
    {
      img: {
        img: pet_2,
        avif: pet_2_avif,
        webp: pet_2_webp,
        alt: 'TamTam Щенок',
      },
      baseWidth: {
        desktop: '47vw',
        mobile: '92vw',
      },
      positions: {
        desktop: {
          left: {
            x: '-34vw',
            y: '31vh',
            rotate: 8,
            width: '54vw',
          },
          right: {
            x: '36vw',
            y: '35vh',
            rotate: -13,
          },
        },
        mobile: {
          left: {
            x: '-32vw',
            y: '39vh',
            rotate: 19,
            width: '102vw',
          },
          right: {
            x: '44vw',
            y: '-16vh',
            rotate: -38,
          },
        },
      },
    },
  ];

  const INITIAL_POSITIONS = {
    desktop: {
      left: { x: '-100vw', y: '100vh', rotate: 15 },
      right: { x: '100vw', y: '100vh', rotate: -18 },
    },
    mobile: {
      left: { x: '-100vw', y: '100vh', rotate: 20 },
      right: { x: '100vw', y: '0', rotate: -20 },
    },
  };

  const getAnimalWidth = useCallback(
    (animal, side) => {
      // Используем displayMode вместо isMobile
      const mode = displayMode;

      const positionWidth = animal.positions?.[mode]?.[side]?.width;
      if (positionWidth !== undefined) {
        return positionWidth;
      }

      const baseWidth = animal.baseWidth?.[mode];
      if (baseWidth !== undefined) {
        return baseWidth;
      }

      return mode === 'mobile' ? '90vw' : '50vw';
    },
    [displayMode] // Зависимость от displayMode
  );

  // Получение данных о текущих животных
  const getCurrentAnimalsData = useCallback(
    (indices = animalIndices) => {
      const [leftIndex, rightIndex] = indices;
      const leftAnimal = ANIMALS_DATA[leftIndex];
      const rightAnimal = ANIMALS_DATA[rightIndex];

      return {
        left: {
          ...leftAnimal,
          img: leftAnimal.img,
          width: getAnimalWidth(leftAnimal, 'left'),
          // Используем displayMode для выбора позиций
          positions: leftAnimal.positions[displayMode].left,
        },
        right: {
          ...rightAnimal,
          img: rightAnimal.img,
          width: getAnimalWidth(rightAnimal, 'right'),
          positions: rightAnimal.positions[displayMode].right,
        },
      };
    },
    [animalIndices, displayMode, getAnimalWidth] // displayMode вместо isMobile
  );

  // Получение начальных позиций
  const getInitialPositions = useCallback(() => {
    return INITIAL_POSITIONS[displayMode]; // Используем displayMode
  }, [displayMode]);

  // Сброс позиций к начальным
  const resetToInitialPositions = useCallback(() => {
    if (!leftAnimalRef.current || !rightAnimalRef.current) return;

    const initialPositions = getInitialPositions();
    const currentAnimals = getCurrentAnimalsData();

    gsap.set(leftAnimalRef.current, {
      x: initialPositions.left.x,
      y: initialPositions.left.y,
      opacity: 0,
      rotation: initialPositions.left.rotate,
      width: currentAnimals.left.width,
      immediateRender: true,
    });
    gsap.set(rightAnimalRef.current, {
      x: initialPositions.right.x,
      y: initialPositions.right.y,
      opacity: 0,
      rotation: initialPositions.right.rotate,
      width: currentAnimals.right.width,
      immediateRender: true,
    });
  }, [displayMode, getInitialPositions, getCurrentAnimalsData]); // displayMode вместо isMobile

  // Создание анимационной последовательности
  const createAnimationTimeline = useCallback(() => {
    if (!leftAnimalRef.current || !rightAnimalRef.current) return null;

    resetToInitialPositions();

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
      onRepeat: () => {
        setAnimalIndices((prev) => [(prev[0] + 1) % ANIMALS_DATA.length, (prev[1] + 1) % ANIMALS_DATA.length]);
        isFirstCycleRef.current = false;
      },
    });

    const initialPositions = getInitialPositions();
    const currentAnimals = getCurrentAnimalsData();

    // 1: ВХОД В ЦЕНТР
    tl.to(
      leftAnimalRef.current,
      {
        x: currentAnimals.left.positions.x,
        y: currentAnimals.left.positions.y,
        rotation: currentAnimals.left.positions.rotate,
        duration: ANIMATION_CONFIG.ENTRY_DURATION,
        ease: ANIMATION_CONFIG.ENTRY_EASE,
        opacity: 1,
        onStart: () => {
          animalChangeTriggeredRef.current = false;
          if (!isFirstCycleRef.current && !animalChangeTriggeredRef.current) {
            setTimeout(() => {
              triggerAnimalChange();
              animalChangeTriggeredRef.current = true;
            }, 800);
          }
        },
      },
      0
    );

    tl.to(
      rightAnimalRef.current,
      {
        x: currentAnimals.right.positions.x,
        y: currentAnimals.right.positions.y,
        opacity: 1,
        rotation: currentAnimals.right.positions.rotate,
        duration: ANIMATION_CONFIG.ENTRY_DURATION,
        ease: ANIMATION_CONFIG.ENTRY_EASE,
      },
      0
    );

    // 2: ПАУЗА В ЦЕНТРЕ
    const pauseEndTime = ANIMATION_CONFIG.ENTRY_DURATION + ANIMATION_CONFIG.CENTER_PAUSE_DURATION;

    // 3: ВЫХОД ИЗ ЦЕНТРА
    tl.to(
      leftAnimalRef.current,
      {
        x: initialPositions.left.x,
        y: initialPositions.left.y,
        rotation: initialPositions.left.rotate,
        duration: ANIMATION_CONFIG.EXIT_DURATION,
        ease: ANIMATION_CONFIG.EXIT_EASE,
      },
      pauseEndTime
    );

    tl.to(
      rightAnimalRef.current,
      {
        x: initialPositions.right.x,
        y: initialPositions.right.y,
        rotation: initialPositions.right.rotate,
        duration: ANIMATION_CONFIG.EXIT_DURATION,
        ease: ANIMATION_CONFIG.EXIT_EASE,
      },
      pauseEndTime
    );

    return tl;
  }, [displayMode, getInitialPositions, getCurrentAnimalsData, resetToInitialPositions, triggerAnimalChange]); // displayMode вместо isMobile

  // Эффект для инициализации/остановки анимации
  useEffect(() => {
    let initialTimeout;

    if (isActive && leftAnimalRef.current && rightAnimalRef.current) {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      isFirstCycleRef.current = true;
      resetToInitialPositions();

      timelineRef.current = createAnimationTimeline();

      initialTimeout = setTimeout(() => {
        if (timelineRef.current) {
          timelineRef.current.restart();
          isInitializedRef.current = true;
        }
      }, ANIMATION_CONFIG.INITIAL_DELAY * 1000);
    } else {
      if (timelineRef.current) {
        timelineRef.current.pause();
        if (!isActive) {
          resetToInitialPositions();
        }
      } else if (!isActive) {
        resetToInitialPositions();
      }
    }

    return () => {
      clearTimeout(initialTimeout);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isActive, createAnimationTimeline, resetToInitialPositions]);

  // Эффект для обработки изменения ориентации/размера
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (isActive && timelineRef.current) {
          const wasPlaying = timelineRef.current.isActive();

          resetToInitialPositions();

          timelineRef.current.kill();
          timelineRef.current = createAnimationTimeline();

          if (wasPlaying) {
            timelineRef.current.restart();
          }
        } else if (!isActive) {
          resetToInitialPositions();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isActive, createAnimationTimeline, resetToInitialPositions]);

  const currentAnimals = useMemo(() => {
    return getCurrentAnimalsData();
  }, [animalIndices, getCurrentAnimalsData]);

  // Эффект для обновления анимации при смене животных
  useEffect(() => {
    if (timelineRef.current && timelineRef.current.isActive()) {
      const currentTime = timelineRef.current.time();

      timelineRef.current.kill();
      timelineRef.current = createAnimationTimeline();

      const newDuration = timelineRef.current.duration();
      const restoredProgress = (currentTime % newDuration) / newDuration;
      timelineRef.current.progress(restoredProgress);
      timelineRef.current.play();
    }
  }, [animalIndices, createAnimationTimeline]);

  // Эффект для очистки
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <div className={styles.Intro} id={id} aria-label="Вступительная секция с анимированными питомцами" role="region">
      <div className={styles.Intro__container}>
        <h1 className={styles.Intro__title}>Tam Tam Мой милый питомец</h1>
        <div
          className={styles.Intro__animals}
          aria-live="polite"
          aria-label={`Показ питомцев: ${currentAnimals.left.img.alt} слева и ${currentAnimals.right.img.alt} справа`}
          data-orientation={isPortrait ? 'portrait' : 'landscape'} // Добавляем data-атрибут для CSS
          data-mode={displayMode} // И display mode
        >
          <div ref={leftAnimalRef} className={`${styles.Intro__animal} ${styles.Intro__animal_left}`} aria-hidden="true">
            <picture>
              <source type="image/avif" srcSet={currentAnimals.left.img.avif} />
              <source type="image/webp" srcSet={currentAnimals.left.img.webp} />
              <img src={currentAnimals.left.img.img} alt={currentAnimals.left.img.alt} decoding="async" width="100%" height="auto" aria-hidden="true" />
            </picture>
          </div>

          <div ref={rightAnimalRef} className={`${styles.Intro__animal} ${styles.Intro__animal_right}`} aria-hidden="true">
            <picture>
              <source type="image/avif" srcSet={currentAnimals.right.img.avif} />
              <source type="image/webp" srcSet={currentAnimals.right.img.webp} />
              <img src={currentAnimals.right.img.img} alt={currentAnimals.right.img.alt} decoding="async" width="100%" height="auto" aria-hidden="true" />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
