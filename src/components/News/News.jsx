import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useMobile } from '../../contexts/MobileContext';
import styles from './News.module.scss';

import logo_tamtam from '../../assets/images/news-logo.png';

import dog from '../../assets/images/slider-character-front-3.png';
import dog_avif from '../../assets/images/slider-character-front-3.avif';
import dog_webp from '../../assets/images/slider-character-front-3.webp';

import cat from '../../assets/images/slider-character-front-2.png';
import cat_avif from '../../assets/images/slider-character-front-2.avif';
import cat_webp from '../../assets/images/slider-character-front-2.webp';

import sheep from '../../assets/images/pet-1.png';
import sheep_avif from '../../assets/images/pet-1.avif';
import sheep_webp from '../../assets/images/pet-1.webp';

const circles = [{ delay: 0.5 }, { delay: 0.4 }, { delay: 0.3 }];

function News({ id, isActive }) {
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const circlesRef = useRef([]);
  const windowRef = useRef(null);
  const sheepRef = useRef(null);
  const ballonRef = useRef(null);
  const buttonRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!timelineRef.current) {
        const tl = gsap.timeline({ paused: true });

        // 1. Появление шаров
        circlesRef.current.forEach((el, i) => {
          if (!el) return;
          tl.from(
            el,
            {
              opacity: 0,
              y: '100%',
              ease: 'linear',
              delay: circles[i].delay,
              duration: 0.5,
            },
            0.3
          );
        });

        // 2. Барашек
        tl.from(
          sheepRef.current,
          {
            y: isMobile ? '100%' : '',
            x: isMobile ? '100%' : '',
            scale: isMobile ? '' : 0,
            duration: 1,
            ease: isMobile ? 'elastic.out(0.6, 0.7)' : 'elastic.out(0.9, 0.6)',
          },
          1.5
        );

        // 3. Балун
        tl.from(
          ballonRef.current,
          {
            scale: 0,
            duration: 0.4,
            ease: 'ease',
          },
          2.5
        );

        // 4. Балун
        tl.from(
          windowRef.current,
          {
            opacity: 0,
            duration: 1,
            ease: 'ease',
          },
          3.3
        );

        tl.to(
          buttonRef.current,

          {
            duration: 0.8,
            scale: 1.1,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.6, // Задержка больше чем у кошки
          },
          4
        );

        timelineRef.current = tl;
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Управление воспроизведением
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isActive) {
      timelineRef.current.restart();
    } else {
      timelineRef.current.pause();
    }
  }, [isActive]);

  return (
    <div id={id} ref={containerRef} className={styles.News}>
      <div className={styles.News__background}>
        {[0, 1, 2].map((index) => (
          <div key={index} ref={(el) => (circlesRef.current[index] = el)} />
        ))}
      </div>
      <div className={styles.News__container}>
        <div ref={windowRef} className={styles.News__window}>
          <div className={styles.News__top}>
            <div className={styles.News__logo}>
              <picture>
                <img src={logo_tamtam} loading="lazy" alt="Логотип TamTam"></img>
              </picture>
            </div>

            <div className={styles.News__animals}>
              <div className={`${styles.News__animal} ${styles.News__animal_cat}`}>
                <picture>
                  <source type="image/avif" srcSet={cat_avif} />
                  <source type="image/webp" srcSet={cat_webp} />
                  <img src={cat} width="544" height="476" alt="Щенок" loading="lazy" />
                </picture>
              </div>
              <div className={`${styles.News__animal} ${styles.News__animal_dog}`}>
                <picture>
                  <source type="image/avif" srcSet={dog_avif} />
                  <source type="image/webp" srcSet={dog_webp} />
                  <img src={dog} width="546" height="439" alt="Щенок" loading="lazy" />
                </picture>
              </div>
            </div>
          </div>
          <div className={styles.News__bottom}>
            <div className={styles.News__text}>Новые персонажи в Tam Tam!</div>
            <div className={styles.News__button}>
              <a href="https://www.rustore.ru/catalog/app/ru.laba.tamtam">
                <div ref={buttonRef}></div>
                <span>Играть →</span>
              </a>
            </div>
          </div>
        </div>
        <div ref={sheepRef} className={styles.News__sheep}>
          <div className={styles.News__picture}>
            <picture>
              <source type="image/avif" srcSet={sheep_avif} />
              <source type="image/webp" srcSet={sheep_webp} />
              {/* <source media="(max-width: 768px)" srcSet={sheep_mob_avif} type="image/avif" />
                <source media="(max-width: 768px)" srcSet={sheep_mob_webp} type="image/webp" /> */}
              <img src={sheep} width="771" height="793" alt="Овечка" loading="lazy" />
            </picture>
          </div>
          <div ref={ballonRef} className={styles.News__ballon}>
            <span>Мои новые друзья!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
