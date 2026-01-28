import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMobile } from '../../contexts/MobileContext';
import styles from './AppStoresSecond.module.scss';

import logo_google from '../../assets/images/app-stores-google.svg';
import logo_ru from '../../assets/images/app-stores-rustore.svg';
import logo_gallery from '../../assets/images/app-stores-appgallery.svg';
import logo_app from '../../assets/images/app-stores-appstore.svg';

import item_4 from '../../assets/images/app-stores-item-4.png';
import item_4_avif from '../../assets/images/app-stores-item-4.avif';
import item_4_webp from '../../assets/images/app-stores-item-4.webp';
import item_5 from '../../assets/images/app-stores-item-5.png';
import item_5_avif from '../../assets/images/app-stores-item-5.avif';
import item_5_webp from '../../assets/images/app-stores-item-5.webp';
import item_6 from '../../assets/images/app-stores-item-6.png';
import item_6_avif from '../../assets/images/app-stores-item-6.avif';
import item_6_webp from '../../assets/images/app-stores-item-6.webp';

import text_1_desk from '../../assets/images/app-stores-text-2-desk.svg';
import text_1_mob from '../../assets/images/app-stores-text-2-mob.svg';

const items = [
  { img: { img: item_4, avif: item_4_avif, webp: item_4_webp }, angle: '-5', x: '-11', y: '-11', className: styles.AppStoresSecond__item_1, duration: 5 },
  { img: { img: item_5, avif: item_5_avif, webp: item_5_webp }, angle: '0', x: '-0', y: '-38', className: styles.AppStoresSecond__item_2, duration: 3 },
  { img: { img: item_6, avif: item_6_avif, webp: item_6_webp }, angle: '-5', x: '-6', y: '-9', className: styles.AppStoresSecond__item_3, duration: 4 },
];

function AppStoresSecond({ id, isActive }) {
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const textRef = useRef(null);
  const storesRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    let isPaused = false;

    const handleKey = (e) => {
      if (e.key === ' ' && e.ctrlKey && timelineRef.current) {
        e.preventDefault(); // чтобы не сработал print

        if (isPaused) {
          // Включаем обратно
          timelineRef.current.play();
        } else {
          // Пауза на текущем кадре
          timelineRef.current.pause();
        }

        isPaused = !isPaused;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!timelineRef.current) {
        const tl = gsap.timeline({ paused: true });

        // 1. Появление
        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          tl.to(
            el,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1.5,
              ease: 'ease',
            },
            0.3
          );
        });

        // 2. Колебания
        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          const angle = items[i].angle;
          const left = items[i].x;
          const top = items[i].y;
          const durationtime = items[i].duration;

          tl.to(
            el,
            {
              rotation: -angle,
              duration: durationtime,
              repeat: -1,
              yoyo: true,
              x: left,
              y: top,
              ease: 'linear',
            },
            1.8
          );
        });

        // 3. Текст
        tl.to(
          textRef.current,
          {
            scale: 1,
            duration: 1.2,
            ease: 'elastic.out(0.9, 0.6)',
          },
          1
        );

        // 4. Магазины
        const delays = [1.25, 1.3, 1.25, 1.3];
        storesRef.current.forEach((el, i) => {
          if (!el) return;
          tl.to(
            el,
            {
              scale: 1,
              duration: 1,
              ease: 'elastic.out(0.9, 0.6)',
            },
            delays[i]
          );
        });

        timelineRef.current = tl;
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Управление воспроизведением
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isActive) {
      // Перезапускаем с нуля
      timelineRef.current.restart();
    } else {
      // Останавливаем, но НЕ убиваем и НЕ сбрасываем
      timelineRef.current.pause();
    }
  }, [isActive]);

  return (
    <div ref={containerRef} className={styles.AppStoresSecond}>
      <div id={id} className={styles.AppStoresSecond__container}>
        <ul className={styles.AppStoresSecond__items}>
          {items.map(({ img, className }, i) => (
            <li key={i} ref={(el) => (itemsRef.current[i] = el)} className={`${styles.AppStoresSecond__item} ${className}`} style={{ opacity: 0 }}>
              <picture>
                <source type="image/avif" srcSet={img.avif} />
                <source type="image/webp" srcSet={img.webp} />
                <img src={img} width="395" height="395" alt="" loading="lazy" />
              </picture>
            </li>
          ))}
        </ul>

        <div ref={textRef} className={styles.AppStoresSecond__text} style={{ scale: 0, transformOrigin: 'center' }}>
          <img src={isMobile ? text_1_mob : text_1_desk} width="970" height="296" alt="Играй на телефоне" loading="lazy" />
        </div>

        <ul className={styles.AppStoresSecond__stores}>
          {[
            { src: logo_app, className: styles.AppStoresSecond__store_app, href: '#', alt: 'Логотип AppStore' },
            { src: logo_google, className: styles.AppStoresSecond__store_google, href: '#', alt: 'Логотип GooglePlay' },
            { src: logo_gallery, className: styles.AppStoresSecond__store_gallery, href: '#', alt: 'Логотип AppGallery' },
            { src: logo_ru, className: styles.AppStoresSecond__store_ru, href: 'https://www.rustore.ru/catalog/app/ru.laba.iching', alt: 'Логотип RuStore' },
          ].map(({ src, className, href, alt }, i) => (
            <li key={i} ref={(el) => (storesRef.current[i] = el)} className={`${styles.AppStoresSecond__store} ${className}`} style={{ scale: 0, transformOrigin: 'center' }}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <img src={src} loading="lazy" alt={alt} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AppStoresSecond;
