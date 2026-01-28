import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMobile } from '../../contexts/MobileContext';
import styles from './AppStoresFirst.module.scss';

import logo_google from '../../assets/images/app-stores-google.svg';
import logo_ru from '../../assets/images/app-stores-rustore.svg';
import logo_gallery from '../../assets/images/app-stores-appgallery.svg';
import logo_app from '../../assets/images/app-stores-appstore.svg';

import item_1 from '../../assets/images/app-stores-item-1.png';
import item_1_avif from '../../assets/images/app-stores-item-1.avif';
import item_1_webp from '../../assets/images/app-stores-item-1.webp';
import item_2 from '../../assets/images/app-stores-item-2.png';
import item_2_avif from '../../assets/images/app-stores-item-2.avif';
import item_2_webp from '../../assets/images/app-stores-item-2.webp';
import item_3 from '../../assets/images/app-stores-item-3.png';
import item_3_avif from '../../assets/images/app-stores-item-3.avif';
import item_3_webp from '../../assets/images/app-stores-item-3.webp';

import text_1_desk from '../../assets/images/app-stores-text-1-desk.svg';
import text_1_mob from '../../assets/images/app-stores-text-1-mob.svg';

const items = [
  { img: { img: item_1, avif: item_1_avif, webp: item_1_webp }, angle: 3, className: styles.AppStoresFirst__item_1, duration: 4.5, delay: 0.3 },
  { img: { img: item_2, avif: item_2_avif, webp: item_2_webp }, angle: 6, className: styles.AppStoresFirst__item_2, duration: 3, delay: 0.5 },
  { img: { img: item_3, avif: item_3_avif, webp: item_3_webp }, angle: 7, className: styles.AppStoresFirst__item_3, duration: 4, delay: 0.1 },
];

function AppStoresFirst({ id, isActive }) {
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const textRef = useRef(null);
  const storesRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!timelineRef.current) {
        const tl = gsap.timeline({ paused: true });

        // 1. Появление + ротация
        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          const angle = items[i].angle;
          tl.to(
            el,
            {
              opacity: 1,
              rotation: angle,
              duration: 1,
              ease: 'linear',
            },
            0.3
          );
        });

        // 2. Колебания
        itemsRef.current.forEach((el, i) => {
          if (!el) return;
          const angle = items[i].angle;
          const durationtime = items[i].duration;
          const delaytime = items[i].delay;
          tl.to(
            el,
            {
              rotation: -angle,
              duration: durationtime,
              repeat: -1,
              yoyo: true,
              ease: 'none',
              delay: delaytime,
            },
            1.3
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
    <div ref={containerRef} className={styles.AppStoresFirst}>
      <div id={id} className={styles.AppStoresFirst__container}>
        <ul className={styles.AppStoresFirst__items}>
          {items.map(({ img, className }, i) => (
            <li key={i} ref={(el) => (itemsRef.current[i] = el)} className={`${styles.AppStoresFirst__item} ${className}`} style={{ opacity: 0 }}>
              <picture>
                <source type="image/avif" srcSet={img.avif} />
                <source type="image/webp" srcSet={img.webp} />
                <img src={img} width="395" height="395" alt="" loading="lazy" />
              </picture>
            </li>
          ))}
        </ul>

        <div ref={textRef} className={styles.AppStoresFirst__text} style={{ scale: 0, transformOrigin: 'center' }}>
          <img src={isMobile ? text_1_mob : text_1_desk} width="970" height="296" alt="Играй на телефоне" loading="lazy" />
        </div>

        <ul className={styles.AppStoresFirst__stores}>
          {[
            { src: logo_app, className: styles.AppStoresFirst__store_app, href: '#', alt: 'Логотип AppStore' },
            { src: logo_google, className: styles.AppStoresFirst__store_google, href: '#', alt: 'Логотип GooglePlay' },
            { src: logo_gallery, className: styles.AppStoresFirst__store_gallery, href: '#', alt: 'Логотип AppGallery' },
            { src: logo_ru, className: styles.AppStoresFirst__store_ru, href: 'https://www.rustore.ru/catalog/app/ru.laba.iching', alt: 'Логотип RuStore' },
          ].map(({ src, className, href, alt }, i) => (
            <li key={i} ref={(el) => (storesRef.current[i] = el)} className={`${styles.AppStoresFirst__store} ${className}`} style={{ scale: 0, transformOrigin: 'center' }}>
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

export default AppStoresFirst;
