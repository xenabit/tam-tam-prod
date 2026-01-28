import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useSection } from '../../contexts/SectionContext';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { gsap } from 'gsap';
import { useMobile } from '../../contexts/MobileContext';
import './Carousel.scss';

import intro_1 from '../../assets/images/carousel-intro-1.png';
import intro_1_avif from '../../assets/images/carousel-intro-1.avif';
import intro_1_webp from '../../assets/images/carousel-intro-1.png';
import intro_2 from '../../assets/images/carousel-intro-2.png';
import intro_2_avif from '../../assets/images/carousel-intro-2.avif';
import intro_2_webp from '../../assets/images/carousel-intro-2.png';

import text_desk from '../../assets/images/carousel-text.svg';
import text_mob from '../../assets/images/carousel-text-mob.svg';

import item_1 from '../../assets/images/carouse-1.png';
import item_1_avif from '../../assets/images/carouse-1.avif';
import item_1_webp from '../../assets/images/carouse-1.webp';
import item_2 from '../../assets/images/carouse-2.png';
import item_2_avif from '../../assets/images/carouse-2.avif';
import item_2_webp from '../../assets/images/carouse-2.webp';
import item_3 from '../../assets/images/carouse-3.png';
import item_3_avif from '../../assets/images/carouse-3.avif';
import item_3_webp from '../../assets/images/carouse-3.webp';
import item_4 from '../../assets/images/carouse-4.png';
import item_4_avif from '../../assets/images/carouse-4.avif';
import item_4_webp from '../../assets/images/carouse-4.webp';
import item_5 from '../../assets/images/carouse-5.png';
import item_5_avif from '../../assets/images/carouse-5.avif';
import item_5_webp from '../../assets/images/carouse-5.webp';
import item_6 from '../../assets/images/carouse-6.png';
import item_6_avif from '../../assets/images/carouse-6.avif';
import item_6_webp from '../../assets/images/carouse-6.webp';
import item_7 from '../../assets/images/carouse-7.png';
import item_7_avif from '../../assets/images/carouse-7.avif';
import item_7_webp from '../../assets/images/carouse-7.webp';

import pet_1 from '/src/assets/images/pet-1.png';
import pet_1_avif from '/src/assets/images/pet-1.avif';
import pet_1_webp from '/src/assets/images/pet-1.webp';
import pet_2 from '/src/assets/images/pet-2.png';
import pet_2_avif from '/src/assets/images/pet-2.avif';
import pet_2_webp from '/src/assets/images/pet-2.webp';
import pet_3 from '/src/assets/images/pet-3.png';
import pet_3_avif from '/src/assets/images/pet-3.avif';
import pet_3_webp from '/src/assets/images/pet-3.webp';

function CarouselComponent({ id, isActive }) {
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const itemsBoxRef = useRef(null);
  const itemsRef = useRef([]);
  const elementsRef = useRef([]);
  const animationRef = useRef(null);
  const characterRef = useRef(null);
  const backgroundRef = useRef(null);
  const timelineRef = useRef(null);

  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isFirstAnimationComplete, setIsFirstAnimationComplete] = useState(false);
  const { updateCarouselSlide } = useSection();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    return () => {
      if (!isActive) {
        updateCarouselSlide(0);
        setIsIntroComplete(false);
        setIsFirstAnimationComplete(false);
      }
    };
  }, [isActive, updateCarouselSlide]);

  const elements = useMemo(
    () => [
      {
        picture: {
          img: intro_1,
          avif: intro_1_avif,
          webp: intro_1_webp,
        },
        title: 'Пшеница',
      },
      {
        picture: {
          img: intro_2,
          avif: intro_2_avif,
          webp: intro_2_webp,
        },
        title: 'Тортик',
      },
    ],
    []
  );

  const items = useMemo(
    () => [
      {
        title: 'Люби',
        icon: { img: item_1, avif: item_1_avif, webp: item_1_webp },
      },
      {
        title: 'Играй',
        icon: { img: item_2, avif: item_2_avif, webp: item_2_webp },
      },
      {
        title: 'Ухаживай',
        icon: { img: item_3, avif: item_3_avif, webp: item_3_webp },
      },
      {
        title: 'Наряжай',
        icon: { img: item_4, avif: item_4_avif, webp: item_4_webp },
      },
      {
        title: 'Корми',
        icon: { img: item_5, avif: item_5_avif, webp: item_5_webp },
      },
      {
        title: 'Заботься',
        icon: { img: item_6, avif: item_6_avif, webp: item_6_webp },
      },
      {
        title: 'Веселись',
        icon: { img: item_7, avif: item_7_avif, webp: item_7_webp },
      },
    ],
    []
  );

  const itemsPosition = useMemo(
    () => [
      {
        x: isMobile ? '-352%' : '-259%',
        y: '-214%',
        width: isMobile ? '5.5rem' : '9.3vw',
        isSpecial: false,
      },
      {
        x: '-311%',
        y: '-81%',
        width: isMobile ? '6rem' : '10vw',
        isSpecial: false,
      },
      {
        x: '-214%',
        y: '43%',
        width: isMobile ? '6.5rem' : '11vw',
        isSpecial: false,
      },
      {
        x: '-50%',
        y: '74%',
        width: isMobile ? '7rem' : '12vw',
        isSpecial: true,
        background: '#2ea56c',
        borderColor: '#80dcb0',
        scaleImg: 1.5,
        scaleTitle: isMobile ? '1.222' : '1.333',
      },
      {
        x: '110%',
        y: '41%',
        width: isMobile ? '6.5rem' : '11vw',
        isSpecial: false,
      },
      {
        x: '212%',
        y: '-82%',
        width: isMobile ? '6rem' : '10vw',
        isSpecial: false,
      },
      {
        x: isMobile ? '253%' : '157%',
        y: '-217%',
        width: isMobile ? '5.5rem' : '9.3vw',
        isSpecial: false,
        isAround: true,
      },
    ],
    []
  );

  const slideConfig = useMemo(
    () => [
      {
        pet: {
          img: pet_3,
          avif: pet_3_avif,
          webp: pet_3_webp,
          alt: 'TamTam Котёнок',
        },
        background: '#39C883',
        fill: '#2EA56C',
        outline: '#FCCD67',
        borderBack: '#FFFFFFA3',
        borderMain: '#80DCB0',
        iconBack: '#82CAA7',
        iconMain: '#2EA56C',
        specialBackground: '#2ea56c',
        specialBorder: '#80dcb0',
      },
      {
        pet: {
          img: pet_2,
          avif: pet_2_avif,
          webp: pet_2_webp,
          alt: 'TamTam Ягнёнок',
        },
        background: '#EA437B',
        fill: '#C41650',
        outline: '#F49CBA',
        borderBack: '#FFFFFFA3',
        borderMain: '#F49CBA',
        iconBack: '#DD89A6',
        iconMain: '#C41650',
        specialBackground: '#C41650',
        specialBorder: '#F49CBA',
      },
      {
        pet: {
          img: pet_1,
          avif: pet_1_avif,
          webp: pet_1_webp,
          alt: 'TamTam Щенок',
        },
        background: '#FFBE2D',
        fill: '#FFBE2D',
        outline: '#FFD881',
        borderBack: '#FFFFFFA3',
        borderMain: '#FFE6AF',
        iconBack: '#FFD983',
        iconMain: '#FFBE2D',
        specialBackground: '#FFBE2D',
        specialBorder: '#FFE6AF',
      },
    ],
    []
  );

  if (typeof window !== 'undefined') {
    gsap.registerPlugin(MotionPathPlugin);
  }

  /**
   * Функция анимации входа (интро)
   */
  const playIntroAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsIntroComplete(true);
          setIsFirstAnimationComplete(true);
        },
      });

      // Анимация текста
      if (textRef.current) {
        tl.fromTo(
          textRef.current,
          {
            scale: 0,
          },
          {
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(0.9, 0.6)',
          },
          1
        );
      }

      // Анимация элементов
      elementsRef.current.forEach((el, i) => {
        if (!el || !elements[i]) return;

        tl.to(
          el,
          {
            x: 0,
            y: 0,
            duration: 1.5,
            ease: 'ease',
          },
          0.5
        );
      });

      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            top: '-100%',
            duration: 1,
            ease: 'linear',
          },
          2.7
        );
      }

      elementsRef.current.forEach((el) => {
        if (!el) return;
        tl.to(
          el,
          {
            top: '-100%',
            duration: 1,
            ease: 'linear',
          },
          2.7
        );
      });

      // Появление животного
      tl.to(
        characterRef.current,
        {
          scale: 1,
          duration: 1,
          ease: 'elastic.out(0.9, 0.6)',
        },
        4
      );

      // Устанавливаем начальные позиции иконок
      if (itemsRef.current[0]) {
        tl.set(
          itemsRef.current[0],
          {
            x: '-50%',
            y: '74%',
            width: isMobile ? '7rem' : '12vw',
          },
          4
        );
      }

      if (itemsRef.current[1]) {
        tl.set(
          itemsRef.current[1],
          {
            x: '110%',
            y: '41%',
            width: isMobile ? '6.5rem' : '11vw',
          },
          4
        );
      }

      if (itemsRef.current[2]) {
        tl.set(
          itemsRef.current[2],
          {
            x: '212%',
            y: '-82%',
            width: isMobile ? '6rem' : '10vw',
          },
          4
        );
      }

      if (itemsRef.current[3]) {
        tl.set(
          itemsRef.current[3],
          {
            x: isMobile ? '253%' : '157%',
            y: '-217%',
            width: isMobile ? '5.5rem' : '9.3vw',
          },
          4
        );
      }

      if (itemsRef.current[4]) {
        tl.set(
          itemsRef.current[4],
          {
            x: isMobile ? '-352%' : '-259%',
            y: '-214%',
            width: isMobile ? '5.5rem' : '9.3vw',
          },
          4
        );
      }

      if (itemsRef.current[5]) {
        tl.set(
          itemsRef.current[5],
          {
            x: '-311%',
            y: '-81%',
            width: isMobile ? '6rem' : '10vw',
          },
          4
        );
      }

      if (itemsRef.current[6]) {
        tl.set(
          itemsRef.current[6],
          {
            x: '-214%',
            y: '43%',
            width: isMobile ? '6.5rem' : '11vw',
          },
          4
        );
      }

      // Показываем контейнер с иконками
      tl.to(
        itemsBoxRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: 'none',
        },
        4.2
      );

      // Анимируем элементы
      if (itemsRef.current[0]) {
        tl.to(
          itemsRef.current[0],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: '-50%', y: '74%' },
                { x: '-214%', y: '43%' },
                { x: '-311%', y: '-81%' },
                { x: isMobile ? '-352%' : '-259%', y: '-214%' },
              ],
              curviness: 1.2,
              type: 'soft',
            },
            width: isMobile ? '5.5rem' : '9.3vw',
          },
          4.2
        );
      }

      if (itemsRef.current[1]) {
        tl.to(
          itemsRef.current[1],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: '110%', y: '41%' },
                { x: '-50%', y: '74%' },
                { x: '-214%', y: '43%' },
                { x: '-311%', y: '-81%' },
              ],
              curviness: 1.2,
              type: 'soft',
            },
            width: isMobile ? '6rem' : '10vw',
          },
          4.2
        );
      }

      if (itemsRef.current[2]) {
        tl.to(
          itemsRef.current[2],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: '212%', y: '-82%' },
                { x: '110%', y: '41%' },
                { x: '-50%', y: '74%' },
                { x: '-214%', y: '43%' },
              ],
              curviness: 1.2,
              type: 'soft',
            },
            width: isMobile ? '6.5rem' : '11vw',
          },
          4.2
        );
      }

      if (itemsRef.current[3]) {
        tl.to(
          itemsRef.current[3],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: isMobile ? '253%' : '157%', y: '-217%' },
                { x: '212%', y: '-82%' },
                { x: '110%', y: '41%' },
                { x: '-50%', y: '74%' },
              ],
              curviness: 1.2,
              type: 'soft',
            },
            width: isMobile ? '7rem' : '12vw',
          },
          4.2
        );
      }

      if (itemsRef.current[4]) {
        tl.to(
          itemsRef.current[4],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: isMobile ? '-352%' : '-259%', y: '-214%' },
                { x: '-50%', y: isMobile ? '-350%' : '-284%' },
                { x: isMobile ? '253%' : '157%', y: '-217%' },
                { x: '212%', y: '-82%' },
                { x: '110%', y: '41%' },
              ],
              curviness: 1.5,
              type: 'soft',
            },
            width: isMobile ? '6.5rem' : '11vw',
          },
          4.2
        );
      }

      if (itemsRef.current[5]) {
        tl.to(
          itemsRef.current[5],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: '-311%', y: '-81%' },
                { x: isMobile ? '-352%' : '-259%', y: '-214%' },
                { x: '-50%', y: isMobile ? '-350%' : '-284%' },
                { x: isMobile ? '253%' : '157%', y: '-217%' },
                { x: '212%', y: '-82%' },
              ],
              curviness: 1.5,
              type: 'soft',
            },
            width: isMobile ? '6rem' : '10vw',
          },
          4.2
        );
      }

      if (itemsRef.current[6]) {
        tl.to(
          itemsRef.current[6],
          {
            duration: 1.2,
            ease: 'linear',
            motionPath: {
              path: [
                { x: '-214%', y: '43%' },
                { x: '-311%', y: '-81%' },
                { x: isMobile ? '-352%' : '-259%', y: '-214%' },
                { x: '-50%', y: isMobile ? '-350%' : '-284%' },
                { x: isMobile ? '253%' : '157%', y: '-217%' },
              ],
              curviness: 1.5,
              type: 'soft',
            },
            width: isMobile ? '5.5rem' : '9.3vw',
          },
          4.2
        );
      }

      // Обновляем цвета иконок
      if (itemsRef.current[3]) {
        const iconElement = itemsRef.current[3].querySelector('.Carousel__icon');
        const imgElement = iconElement?.querySelector('img');
        const titleElement = itemsRef.current[3].querySelector('.Carousel__title');

        if (iconElement) {
          tl.to(
            iconElement,
            {
              backgroundColor: '#2ea56c',
              borderColor: '#80dcb0',
              duration: 1,
              ease: 'power2.inOut',
            },
            5.5
          );

          if (imgElement) {
            tl.to(
              imgElement,
              {
                scale: 1.5,
                duration: 1,
                ease: 'power2.inOut',
              },
              5.5
            );
          }
        }
        if (titleElement) {
          tl.to(
            titleElement,
            {
              scale: isMobile ? '1.2' : '1.3334',
              duration: 1,
              ease: 'power2.inOut',
            },
            5.5
          );
        }
      }

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [elements]);

  /**
   * Управление анимацией входа и первой анимацией
   */
  useEffect(() => {
    if (isActive && !isIntroComplete) {
      playIntroAnimation();
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isActive, isIntroComplete, playIntroAnimation]);

  /**
   * Анимирует перемещение элемента по дуге
   */
  const animateArcMovement = useCallback((element, newPosition, timeline) => {
    timeline.to(
      element,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        motionPath: {
          path: [
            { x: '-50%', y: isMobile ? '-350%' : '-284%' },
            { x: newPosition.x, y: newPosition.y },
          ],
          curviness: 1.5,
          type: 'soft',
        },
        width: newPosition.width,
      },
      0
    );
  }, []);

  /**
   * Анимирует линейное перемещение элемента
   */
  const animateLinearMovement = useCallback((element, newPosition, timeline) => {
    timeline.to(
      element,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: newPosition.x,
        y: newPosition.y,
        width: newPosition.width,
      },
      0
    );
  }, []);

  /**
   * Анимирует стили иконки элемента
   */
  const animateIconStyles = useCallback((iconElement, newPosition, slideConfig, timeline) => {
    const styleUpdates = {
      duration: 1.5,
      ease: 'power2.inOut',
    };

    // Устанавливаем цвета в зависимости от типа элемента
    if (newPosition.isSpecial) {
      styleUpdates.backgroundColor = slideConfig.specialBackground;
      styleUpdates.borderColor = slideConfig.specialBorder;
    } else {
      styleUpdates.backgroundColor = slideConfig.iconBack;
      styleUpdates.borderColor = slideConfig.borderBack;
    }

    timeline.to(iconElement, styleUpdates, 0);
  }, []);

  /**
   * Анимирует изображение внутри иконки
   */
  const animateIconImage = useCallback((imgElement, newPosition, timeline) => {
    timeline.to(
      imgElement,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        scale: newPosition.isSpecial ? newPosition.scaleImg || 1.5 : 1,
      },
      0
    );
  }, []);

  /**
   * Анимирует стили заголовка элемента
   */
  const animateTitleStyles = useCallback((titleElement, newPosition, timeline) => {
    timeline.to(
      titleElement,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        scale: newPosition.isSpecial ? newPosition.scaleTitle || '1.2' : isMobile ? '1.1' : '1.2',
      },
      0
    );
  }, []);

  /**
   * Анимирует один элемент карусели
   */
  const animateCarouselItem = useCallback(
    (element, newPosition, slideConfig, timeline) => {
      if (!element) return;

      const iconElement = element.querySelector('.Carousel__icon');
      const imgElement = iconElement?.querySelector('img');
      const titleElement = element.querySelector('.Carousel__title');

      // Выбираем тип анимации движения в зависимости от позиции
      if (newPosition.isAround) {
        animateArcMovement(element, newPosition, timeline);
      } else {
        animateLinearMovement(element, newPosition, timeline);
      }

      // Анимируем стили иконки
      if (iconElement) {
        animateIconStyles(iconElement, newPosition, slideConfig, timeline);

        // Анимируем изображение внутри иконки
        if (imgElement) {
          animateIconImage(imgElement, newPosition, timeline);
        }
      }

      // Анимируем стили заголовка
      if (titleElement) {
        animateTitleStyles(titleElement, newPosition, timeline);
      }
    },
    [animateArcMovement, animateLinearMovement, animateIconStyles, animateIconImage, animateTitleStyles]
  );

  /**
   * Функция получения текущего распределения элементов
   */
  const getCurrentDistribution = useCallback(() => {
    const distribution = Array(7);
    for (let i = 0; i < 7; i++) {
      distribution[i] = {
        item: items[i],
        position: itemsPosition[i],
      };
    }
    return distribution;
  }, [items, itemsPosition]);

  /**
   * Функция получения следующего распределения элементов
   */
  const getNextDistribution = useCallback(
    (currentDist) => {
      if (!currentDist) return getCurrentDistribution();

      const newDistribution = Array(7);
      const lastElement = currentDist[6];

      for (let i = 6; i > 0; i--) {
        newDistribution[i] = currentDist[i - 1];
      }

      newDistribution[0] = lastElement;
      return newDistribution;
    },
    [getCurrentDistribution]
  );

  /**
   * Функция получения конфигурации текущего слайда
   */
  const getCurrentSlideConfig = useCallback((step) => slideConfig[step % slideConfig.length], [slideConfig]);

  /**
   * Функция анимации смены фона
   */
  const animateBackgroundChange = useCallback(
    (newConfig, timeline, step) => {
      if (!backgroundRef.current) return;

      const previousConfig = getCurrentSlideConfig(step - 1);
      const backgroundElement = backgroundRef.current;

      backgroundElement.style.setProperty('--bg-color-current', previousConfig.background);
      backgroundElement.style.setProperty('--bg-color-next', newConfig.background);

      timeline.fromTo(
        backgroundElement,
        {
          '--bg-progress': '0%',
          background: `linear-gradient(to left, var(--bg-color-next) 0%, var(--bg-color-next) 0%, var(--bg-color-current) 0%, var(--bg-color-current) 100%)`,
        },
        {
          '--bg-progress': '100%',
          duration: 1,
          ease: 'power2.inOut',
          background: `linear-gradient(to left, var(--bg-color-next) 0%, var(--bg-color-next) var(--bg-progress), var(--bg-color-current) var(--bg-progress), var(--bg-color-current) 100%)`,
          onComplete: () => {
            backgroundElement.style.background = newConfig.background;
            backgroundElement.style.setProperty('--bg-color-current', newConfig.background);
          },
        },
        0
      );
    },
    [getCurrentSlideConfig]
  );

  /**
   * Функция анимации смены питомца
   */
  const animatePetChange = useCallback((newConfig, timeline) => {
    if (!characterRef.current) return;

    const pictureElement = characterRef.current.querySelector('.Carousel__picture');
    const imgElement = pictureElement?.querySelector('img');
    const sourceAvif = pictureElement?.querySelector('source[type="image/avif"]');
    const sourceWebp = pictureElement?.querySelector('source[type="image/webp"]');

    if (!pictureElement || !imgElement) return;

    // Анимация исчезновения
    timeline.to(
      pictureElement,
      {
        duration: 0.5,
        ease: 'power2.in',
        opacity: 0,
        scale: 0.8,
        y: 20,
      },
      0.2
    );

    // Смена изображения
    timeline.add(() => {
      if (sourceAvif) sourceAvif.setAttribute('srcset', newConfig.pet.avif);
      if (sourceWebp) sourceWebp.setAttribute('srcset', newConfig.pet.webp);
      imgElement.setAttribute('src', newConfig.pet.img);
      imgElement.setAttribute('alt', newConfig.pet.alt);
    }, 0.7);

    // Анимация появления
    timeline.to(
      pictureElement,
      {
        duration: 1,
        ease: 'elastic.out(0.9, 0.5)',
        opacity: 1,
        scale: 1,
        y: 0,
      },
      0.7
    );
  }, []);

  /**
   * Основная функция анимации перехода к новому распределению
   */
  const animateToDistribution = useCallback(
    (distribution, step) => {
      if (!distribution || !itemsRef.current.length) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      const ctx = gsap.context(() => {
        const timeline = gsap.timeline();
        const currentSlideConfig = getCurrentSlideConfig(step);

        // Запускаем анимации фона и питомца
        animateBackgroundChange(currentSlideConfig, timeline, step);
        animatePetChange(currentSlideConfig, timeline);

        // Анимация каждого элемента карусели
        distribution.forEach(({ position }, index) => {
          const element = itemsRef.current[index];
          animateCarouselItem(element, position, currentSlideConfig, timeline);
        });

        animationRef.current = timeline;
      }, containerRef);

      updateCarouselSlide(step % slideConfig.length);

      return () => ctx.revert();
    },
    [getCurrentSlideConfig, animateBackgroundChange, animatePetChange, animateCarouselItem, updateCarouselSlide, slideConfig.length]
  );

  /**
   * Управление циклической анимации элементов
   */
  useEffect(() => {
    if (!isActive || !isIntroComplete || !isFirstAnimationComplete) return;

    let currentDistribution = getCurrentDistribution();
    let animationStep = 0;

    const firstAnimationTimeout = setTimeout(() => {
      const nextDistribution = getNextDistribution(currentDistribution);
      animateToDistribution(nextDistribution, animationStep + 1);
      currentDistribution = nextDistribution;
      animationStep++;
    }, 500); //  Пауза после интро

    const intervalId = setInterval(() => {
      const nextDistribution = getNextDistribution(currentDistribution);
      animateToDistribution(nextDistribution, animationStep + 1);
      currentDistribution = nextDistribution;
      animationStep++;
    }, 3500); //  Интервал цикла

    return () => {
      clearTimeout(firstAnimationTimeout);
      clearInterval(intervalId);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isActive, isIntroComplete, isFirstAnimationComplete, getCurrentDistribution, getNextDistribution, animateToDistribution]);

  return (
    <div id={id} ref={containerRef} className="Carousel" role="region" aria-label="Карусель ухода за питомцем">
      <div ref={backgroundRef} className="Carousel__background" aria-hidden="true" />
      <div className="Carousel__container">
        <div className="Carousel__intro" aria-hidden={isIntroComplete}>
          <div ref={textRef} className="Carousel__text">
            <img src={isMobile ? text_mob : text_desk} width="970" height="296" alt="Как заботиться о питомце?" loading="lazy" decoding="async" />
          </div>

          <ul className="Carousel__elements">
            {elements.map(({ picture, title }, i) => (
              <li key={`intro_${i}`} ref={(el) => (elementsRef.current[i] = el)} className={`Carousel__element Carousel__element_${i + 1}`} aria-hidden="true">
                <picture>
                  <source type="image/avif" srcSet={picture.avif} />
                  <source type="image/webp" srcSet={picture.webp} />
                  <img src={picture.img} width="581" height="598" alt={title} loading="lazy" decoding="async" />
                </picture>
              </li>
            ))}
          </ul>
        </div>

        <div className="Carousel__carousel" aria-hidden={!isIntroComplete}>
          <div ref={characterRef} className="Carousel__character">
            <div className="Carousel__picture">
              <picture>
                <source type="image/avif" srcSet={slideConfig[0].pet.avif} />
                <source type="image/webp" srcSet={slideConfig[0].pet.webp} />
                <img src={slideConfig[0].pet.img} width="447" height="564" alt={slideConfig[0].pet.alt} loading="lazy" decoding="async" />
              </picture>
            </div>
          </div>

          <ul ref={itemsBoxRef} className="Carousel__items" role="list" aria-label="Способы ухода за питомцем">
            {items.map(({ title, icon }, i) => (
              <li key={`item_${i}`} ref={(el) => (itemsRef.current[i] = el)} className={`Carousel__item Carousel__item_${i + 1}`} role="listitem" aria-label={title}>
                <div className="Carousel__icon">
                  <picture>
                    <source type="image/avif" srcSet={icon.avif} />
                    <source type="image/webp" srcSet={icon.webp} />
                    <img src={icon.img} width="395" height="395" alt="" loading="lazy" decoding="async" aria-hidden="true" />
                  </picture>
                </div>
                <div className="Carousel__title">{title}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Обертка с ключом для принудительного перемонтирования
function Carousel({ id, isActive }) {
  const { currentSection } = useSection(); // Получаем текущую секцию

  return (
    <CarouselComponent
      key={`${id}-${currentSection}`} // Ключ меняется при смене секции
      id={id}
      isActive={isActive}
    />
  );
}

export default Carousel;
