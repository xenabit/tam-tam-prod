import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useSection } from '../../contexts/SectionContext';
import { useMobile } from '../../contexts/MobileContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useOrientation } from '../../contexts/OrientationContext';
import styles from './Header.module.scss';
import Logo from '../ui/LogoHeader/LogoHeader';

function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const isMobile = useMobile();
  const isMenuActive = isActive && isMobile;
  const navigate = useNavigate();
  const isPortrait = useOrientation();
  const location = useLocation();
  const { isIntroSection, animalChangeCount } = useSection();
  const { handleNavigation } = useNavigation();
  const logoControls = useAnimation();
  const prevAnimalChangeCountRef = useRef(animalChangeCount);

  const menuActiveColors = isMenuActive ? { fill: '#5B71C1', outline: '#FCCD67' } : null;

  const logoVariants = {
    header: {
      scale: 1,
      position: 'absolute',
      top: '50%',
      left: isMobile ? 0 : '50%',
      right: 'auto',
      x: isMobile ? 0 : '-50%',
      y: isMobile ? '-50%' : '-50%',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    intro: {
      width: 'auto',
      height: isMobile ? '13vh' : '100%',
      scale: isMobile ? 3.6 : 4.2,
      position: 'absolute',
      top: isMobile || isPortrait ? '50vh' : '310%',
      left: '50%',
      x: '-50%',
      y: '-50%',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    entry: {
      scale: isMobile ? 4.6 : 6,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1,
        duration: 0.5,
      },
    },
    jump: {
      scale: [isMobile ? 4.6 : 6, isMobile ? 4.8 : 6.2, isMobile ? 4.55 : 5.95, isMobile ? 4.65 : 6.05, isMobile ? 4.6 : 6],
      transition: {
        duration: 0.8,
        times: [0, 0.3, 0.6, 0.8, 1],
        ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
      },
    },
    entered: {
      scale: isMobile ? 4.6 : 6,
      width: 'auto',
      height: isMobile ? '13vh' : '100%',
      position: 'absolute',
      top: isMobile || isPortrait ? '50vh' : '310%',
      left: '50%',
      x: '-50%',
      y: '-50%',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Анимация увеличения логотипа только при первом появлении животных
  useEffect(() => {
    let initialTimeout;
    let jumpTimeout;

    if (isIntroSection) {
      logoControls.start('intro');

      if (!isEntered) {
        initialTimeout = setTimeout(() => {
          logoControls.start('entry').then(() => {
            logoControls.start('entered');
            setIsEntered(true);
          });
        }, 800);
      } else {
        logoControls.start('entered');
      }
    } else {
      logoControls.stop();
      logoControls.start('header');
      setIsEntered(false);
      setIsJumping(false);
    }

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(jumpTimeout);
      logoControls.stop();
    };
  }, [isIntroSection, logoControls, isMobile, isEntered]);

  useEffect(() => {
    if (isIntroSection && isEntered && animalChangeCount !== prevAnimalChangeCountRef.current) {
      prevAnimalChangeCountRef.current = animalChangeCount;

      if (!isJumping) {
        setIsJumping(true);

        logoControls
          .start('jump')
          .then(() => {
            return logoControls.start('entered');
          })
          .then(() => {
            setIsJumping(false);
          });
      }
    }
  }, [animalChangeCount, isIntroSection, isEntered, logoControls, isJumping]);

  const onClickHandler = useCallback(
    (e) => {
      if (isMobile) {
        setIsActive(false);
      }
      handleNavigation(e, navigate, location);
    },
    [handleNavigation, navigate, location, isMobile]
  );

  return (
    <header className={`${styles.Header} ${isActive && isMobile ? styles.active : ''}`}>
      <div className={styles.Header__menu}>
        <motion.div className={styles.Header__logo} variants={logoVariants} initial="intro" animate={isIntroSection ? logoControls : 'header'} data-testid="header-logo" aria-label="Логотип проекта">
          <Logo viewBox={isIntroSection ? '0 0 124 150' : isMobile ? '0 0 124 124' : '0 0 124 150'} overrideFromMenu={menuActiveColors} />
        </motion.div>
        <nav role="navigation" aria-label="Основная навигация">
          <ul>
            <li className={styles.Header__link}>
              <a href="#slider" onClick={onClickHandler} aria-current={window.location.hash === '#anchorchar' ? 'page' : undefined} aria-label="Перейти к разделу персонажей">
                <span>Персонажи</span>
              </a>
            </li>
            <li className={styles.Header__link}>
              <a href="#carousel" onClick={onClickHandler} aria-current={window.location.hash === '#anchorgame' ? 'page' : undefined} aria-label="Перейти к разделу игр">
                <span>Игры</span>
              </a>
            </li>
            <li className={styles.Header__space}></li>
            <li className={styles.Header__link}>
              <a href="#channels" onClick={onClickHandler} aria-current={window.location.hash === '#anchorchannels' ? 'page' : undefined} aria-label="Перейти к разделу наших каналов">
                <span>Наши каналы</span>
              </a>
            </li>
            <li className={styles.Header__link}>
              <a href="#news" onClick={onClickHandler} aria-current={window.location.hash === '#anchorapp' ? 'page' : undefined} aria-label="Перейти к разделу новостей">
                <span>Новости</span>
              </a>
            </li>
          </ul>
        </nav>
        <button type="button" className={styles.Header__toggle} onClick={() => setIsActive((prev) => !prev)} aria-label="Открыть/закрыть меню" aria-expanded={isActive} aria-controls="main-navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
