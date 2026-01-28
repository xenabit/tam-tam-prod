import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMobile } from '../../contexts/MobileContext';
import styles from './Channels.module.scss';

import text_1_desk from '../../assets/images/channels-desk.svg';
import text_1_mob from '../../assets/images/channels-mob.svg';

import logo_rutube from '../../assets/images/channels-logo-rutube.svg';
import logo_like from '../../assets/images/channels-logo-like.svg';
import logo_tg from '../../assets/images/channels-logo-tg.svg';
import logo_vk from '../../assets/images/channels-logo-vk.svg';
import logo_ok from '../../assets/images/channels-logo-ok.svg';

import animal from '../../assets/images/channels-animal-desk.png';
import animal_avif from '../../assets/images/channels-animal-desk.avif';
import animal_webp from '../../assets/images/channels-animal-desk.webp';

function Channels({ id, isActive }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const circleRef = useRef(null);
  const pictureRef = useRef(null);
  const shadowRef = useRef(null);
  const logosRef = useRef([]);
  const isMobile = useMobile();
  const timelineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (timelineRef.current) return;

      const tl = gsap.timeline({ paused: true });

      // 1. Текст появляется из центра
      tl.fromTo(
        textRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 1,
          ease: 'elastic.out(0.9, 0.6)',
        },
        0.5
      );

      // 2. Текст уезжает вверх
      tl.fromTo(
        textRef.current,
        { opacity: 1 },
        {
          y: isMobile ? '' : '-120%',
          opacity: isMobile ? '' : 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        isMobile ? '' : 2.5
      );

      // 3. Круг появляется
      tl.fromTo(
        circleRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
        },
        isMobile ? 2.1 : 3.1
      );

      // 4. Овечка появляется
      tl.fromTo(
        pictureRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(0.9, 0.6)',
        },
        isMobile ? 3.1 : 3.9
      );
      // 4. Овечка появляется
      tl.fromTo(
        shadowRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.05,
          ease: 'power2.out',
        },
        isMobile ? 3.1 : 3.9
      );

      // 5. ЛОГОТИПЫ
      const logos = logosRef.current;

      // Rutube + Like
      tl.fromTo(
        [logos[0], logos[1]],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1.2, 0.5)',
        },
        isMobile ? 3.4 : 4.2
      );

      // VK + TG
      tl.fromTo(
        [logos[3], logos[4]],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1.2, 0.5)',
        },
        isMobile ? 3.6 : 4.4
      );

      // OK
      tl.fromTo(
        logos[2],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1.2, 0.5)',
        },
        isMobile ? 3.8 : 4.6
      );

      timelineRef.current = tl;
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Запуск/пауза при активации секции
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isActive) {
      timelineRef.current.restart();
    } else {
      timelineRef.current.pause();
    }
  }, [isActive]);

  return (
    <div id={id} ref={containerRef} className={styles.Channels}>
      <div className={styles.Channels__container}>
        {/* Текст */}
        <div ref={textRef} className={styles.Channels__text} style={{ opacity: 0 }}>
          <img src={isMobile ? text_1_mob : text_1_desk} width="970" height="296" alt="Мы в соцсетях" loading="lazy" />
        </div>

        {/* Овечка и логотипы */}
        <div className={styles.Channels__box}>
          <div className={styles.Channels__animal}>
            <div ref={circleRef} className={styles.Channels__circle} style={{ scale: 0 }}>
              <div ref={pictureRef} className={styles.Channels__picture} style={{ scale: 0 }}>
                <div ref={shadowRef}></div>
                <picture>
                  <source type="image/avif" srcSet={animal_avif} />
                  <source type="image/webp" srcSet={animal_webp} />
                  {/* <source media="(max-width: 768px)" srcSet={animal_mob_avif} type="image/avif" />
                  <source media="(max-width: 768px)" srcSet={animal_mob_webp} type="image/webp" /> */}
                  <img src={animal} width="581" height="598" alt="TamTam Овечка" loading="lazy" />
                </picture>
              </div>
            </div>
            <ul className={styles.Channels__logos}>
              {[
                {
                  src: logo_rutube,
                  className: styles.Channels__logo_rutube,
                  alt: 'Rutube',
                },
                {
                  src: logo_like,
                  className: styles.Channels__logo_like,
                  alt: 'Like',
                },
                {
                  src: logo_ok,
                  className: styles.Channels__logo_ok,
                  alt: 'OK',
                },
                {
                  src: logo_vk,
                  href: 'https://vk.com/club232848928?from=groups',
                  className: styles.Channels__logo_vk,
                  alt: 'VK',
                },
                {
                  src: logo_tg,
                  className: styles.Channels__logo_tg,
                  alt: 'Telegram',
                },
              ].map(({ src, className, alt, href }, i) => (
                <li
                  key={i}
                  ref={(el) => (logosRef.current[i] = el)}
                  className={`${styles.Channels__logo} ${className}`}
                  style={{
                    scale: 0,
                    opacity: 0,
                    transformOrigin: 'center',
                  }}
                >
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Ссылка на ${alt}`}>
                      <img src={src} loading="lazy" alt={alt} />
                    </a>
                  ) : (
                    <a>
                      <img src={src} loading="lazy" alt={alt} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Channels;
