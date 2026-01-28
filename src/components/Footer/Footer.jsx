import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMobile } from '../../contexts/MobileContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { gsap } from 'gsap';
import styles from './Footer.module.scss';
import star from '../../assets/images/star.svg';
import logo from '../../assets/images/header-logo.svg';

function Footer({ id, isActive }) {
  const starsBoxRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const contactsRef = useRef(null);
  const { handleNavigation } = useNavigation();

  // Рефы для управления анимациями
  const animationRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);
  const starsRef = useRef([]); // Трек созданных звёзд
  const animationsRef = useRef([]); // Трек активных GSAP анимаций
  const mainTimelineRef = useRef(null); // Главная timeline

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();

  const onClickHandler = useCallback(
    (e) => {
      handleNavigation(e, navigate, location);
    },
    [handleNavigation, navigate, location]
  );

  // Вместо фиксированных значений - адаптивная система
  const getStarCount = () => {
    if (isMobile) return 8;

    const screenArea = window.innerWidth * window.innerHeight;
    if (screenArea < 1200000) return 18;
    if (screenArea < 2000000) return 24;
    return 30;
  };

  const INITIAL_COUNT = getStarCount();

  const INITIAL_POSITIONS = [
    // ===== ВИДИМАЯ ОБЛАСТЬ (первые 10) =====
    { x: 20, y: 25 },
    { x: 0, y: -25 },
    { x: 0, y: 35 },
    { x: -44, y: -42 },
    { x: 44, y: -42 },
    { x: -48, y: 0 },
    { x: 48, y: 0 },
    { x: -30, y: -32 },
    { x: 30, y: -32 },
    { x: -30, y: 30 },
    { x: 30, y: 30 },
    { x: -8, y: -4 },
    { x: 0, y: 20 },

    { x: -300, y: -200 },
    { x: 300, y: -200 },
    { x: -300, y: 200 },
    { x: 300, y: 200 },
    { x: -350, y: -100 },
    { x: 350, y: -100 },
  ].slice(0, INITIAL_COUNT);

  // Функция приостановки всех анимаций
  const pauseAnimations = useCallback(() => {
    // Приостанавливаем главную timeline
    if (mainTimelineRef.current) {
      mainTimelineRef.current.pause();
    }

    // Приостанавливаем все анимации звёзд
    animationsRef.current.forEach((anim) => {
      if (anim && anim.pause) {
        anim.pause();
      }
    });

    // Останавливаем requestAnimationFrame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Функция возобновления всех анимаций
  const resumeAnimations = useCallback(() => {
    // Возобновляем главную timeline
    if (mainTimelineRef.current) {
      mainTimelineRef.current.play();
    }

    // Возобновляем все анимации звёзд
    animationsRef.current.forEach((anim) => {
      if (anim && anim.play) {
        anim.play();
      }
    });

    // Запускаем спавн снова
    if (isActive) {
      startControlledSpawn();
    }
  }, [isActive]);

  // Функция очистки (только при полном удалении)
  const cleanupAnimations = useCallback(() => {
    pauseAnimations();

    // Полностью убиваем все анимации
    if (mainTimelineRef.current) {
      mainTimelineRef.current.kill();
      mainTimelineRef.current = null;
    }

    animationsRef.current.forEach((anim) => {
      if (anim && anim.kill) {
        anim.kill();
      }
    });
    animationsRef.current = [];

    // Удаляем звёзды только если компонент деактивирован
    if (!isActive && starsBoxRef.current) {
      starsBoxRef.current.innerHTML = '';
      starsRef.current = [];
    }
  }, [isActive, pauseAnimations]);

  // Функция проверки видимости страницы
  const isPageVisible = useCallback(() => {
    return document.visibilityState === 'visible';
  }, []);

  // Оптимизированная функция создания звезды
  const createStar = useCallback((posX, posY, initialScale) => {
    const starElement = new Image();
    starElement.src = star;
    starElement.alt = '';

    starElement.loading = 'eager';
    starElement.decoding = 'async';

    Object.assign(starElement.style, {
      position: 'absolute',
      left: `${50 + posX}%`,
      top: `${50 + posY}%`,
      transform: `translate(-50%, -50%) scale(${initialScale})`,
      willChange: 'transform',
      contain: 'strict',
      backfaceVisibility: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      zIndex: -1,
    });

    starsBoxRef.current.appendChild(starElement);
    starsRef.current.push(starElement);

    return starElement;
  }, []);

  // Функция запуска всасывания звезды
  const startSuck = useCallback((starElement) => {
    const dur = Math.random() * 4 + 7; // 4-7 секунд

    const animation = gsap.to(starElement, {
      left: '50%',
      top: '50%',
      scale: 0,
      duration: dur,
      ease: 'linear',
      onComplete: () => {
        // Удаляем звезду и её анимацию
        const starIndex = starsRef.current.indexOf(starElement);
        if (starIndex > -1) {
          starsRef.current.splice(starIndex, 1);
        }

        const animIndex = animationsRef.current.indexOf(animation);
        if (animIndex > -1) {
          animationsRef.current.splice(animIndex, 1);
        }

        starElement.remove();
      },
    });

    animationsRef.current.push(animation);
    return animation;
  }, []);

  const SPAWN_INTERVAL = isMobile ? 400 : 160; // Увеличиваем интервал
  const MAX_STARS = isMobile ? 25 : 80; // Уменьшаем лимит для более равномерного потока

  // Новая функция спавна - создает по 1 звезде за раз
  const spawnSingleStar = useCallback(() => {
    if (!isPageVisible() || !isActive) return;

    // Проверяем лимит с запасом
    if (starsRef.current.length >= MAX_STARS) {
      return;
    }

    const random = (min, max) => Math.random() * (max - min) + min;

    // Более равномерное распределение по углам
    const angle = random(0, Math.PI * 2);
    const distance = random(70, 100);

    const posX = Math.cos(angle) * distance;
    const posY = Math.sin(angle) * distance;

    const newStar = createStar(posX, posY, random(0.4, 0.8));
    startSuck(newStar);
  }, [isActive, createStar, startSuck, isPageVisible]);

  // Обновленная startControlledSpawn
  const startControlledSpawn = useCallback(() => {
    if (!isPageVisible() || !isActive || animationRef.current) return;

    const spawnLoop = () => {
      if (!isPageVisible() || !isActive) {
        clearInterval(animationRef.current);
        animationRef.current = null;
        return;
      }

      spawnSingleStar();
    };

    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    animationRef.current = setInterval(spawnLoop, SPAWN_INTERVAL);
  }, [isActive, spawnSingleStar, isPageVisible]);

  // Основной эффект для анимации
  useEffect(() => {
    if (!isActive) {
      cleanupAnimations();
      return;
    }

    const ctx = gsap.context(() => {}, starsBoxRef);
    const random = (min, max) => Math.random() * (max - min) + min;

    // Создаём начальные звёзды
    const initialStars = INITIAL_POSITIONS.map((pos) => createStar(pos.x, pos.y, random(0.4, 1)));

    // Основная timeline
    const tl = gsap.timeline({
      defaults: { ease: 'linear' },
      paused: !isPageVisible(), // Начинаем с паузы если страница не видна
    });

    mainTimelineRef.current = tl;

    tl.fromTo(starsBoxRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.6, ease: 'elastic.out(1, 0.38)' });

    tl.fromTo(logoRef.current, { y: 100, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 1.6, ease: 'elastic.out(0.9, 0.6)' }, '-=1.8');

    tl.from(
      linksRef.current,
      {
        x: -80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.5,
        ease: 'elastic.out(0.9, 0.3)',
      },
      '-=1.0'
    );

    tl.from(
      contactsRef.current,
      {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    // Запускаем всасывание начальных звёзд
    initialStars.forEach(startSuck);

    // Запускаем спавн, если страница видима
    if (isPageVisible()) {
      startControlledSpawn();
      tl.play();
    }

    // Обработчик изменения видимости страницы
    const handleVisibilityChange = () => {
      if (isPageVisible()) {
        // Возобновляем при возвращении на вкладку
        resumeAnimations();
      } else {
        // Приостанавливаем при уходе со вкладки
        pauseAnimations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup при размонтировании
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupAnimations();
      ctx.revert();
    };
  }, [isActive, cleanupAnimations, createStar, startSuck, spawnSingleStar, isPageVisible, startControlledSpawn, pauseAnimations, resumeAnimations]);

  // Эффект для изменения isActive
  useEffect(() => {
    if (!isActive) {
      cleanupAnimations();
    } else if (isPageVisible()) {
      // При активации и видимой странице - возобновляем
      resumeAnimations();
    }
  }, [isActive, cleanupAnimations, resumeAnimations, isPageVisible]);

  return (
    <footer id={id} className={styles.Footer}>
      <div ref={starsBoxRef} className={styles.Footer__stars} aria-hidden="true" />

      <div className={styles.Footer__container}>
        <div className={styles.Footer__left}>
          <div ref={logoRef} className={styles.Footer__logo}>
            <picture>
              <img src={logo} loading="lazy" alt="TamTam" width="120" height="40" />
            </picture>
          </div>
        </div>

        <div className={styles.Footer__right}>
          <div className={styles.Footer__links}>
            <nav aria-label="Основная навигация">
              <ul>
                {[
                  { title: 'Персонажи', href: '#slider' },
                  { title: 'Игры', href: '#carousel' },
                  { title: 'Наши каналы', href: '#channels' },
                  { title: 'Новости', href: '#news' },
                ].map(({ title, href }, i) => (
                  <li key={i} ref={(el) => (linksRef.current[i] = el)} className={`${styles.Footer__link}`}>
                    <a href={href} onClick={onClickHandler} aria-label={`Перейти к разделу "${title}"`}>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div ref={contactsRef} className={styles.Footer__contacts}>
            <div className={styles.Footer__contact}>
              Адрес:
              <br />
              <a href="https://yandex.ru/maps/-/CLWBj4or" target="_blank" rel="noopener noreferrer" aria-label="Открыть адрес на карте Яндекса">
                125124, г. Москва, 3-я улица Ямского поля, д.&nbsp;20, стр.&nbsp;1
              </a>
            </div>
            <br />
            <div className={styles.Footer__privacy}>
              <Link to="/information" aria-label="Политика конфиденциальности">
                Политика конфиденциальности
              </Link>
              &emsp;
              <a className={styles.Footer__laba} href="https://laba-laba.ru/" target="_blank" rel="noopener noreferrer" aria-label="Сайт компании LABA">
                © LABA
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
