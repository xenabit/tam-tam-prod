import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sectionConfig } from '../constants/sectionConfig';

const SectionContext = createContext();

export function SectionProvider({ children }) {
  const [currentSection, setCurrentSection] = useState('intro');
  const [isIntroSection, setIsIntroSection] = useState(true);
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [sliderSlide, setSliderSlide] = useState(0);
  const [animalChangeCount, setAnimalChangeCount] = useState(0);

  const isAnimatingRef = useRef(false);

  const updateCarouselSlide = useCallback((slideIndex) => {
    setCarouselSlide(slideIndex);
  }, []);

  const updateSliderSlide = useCallback((slideIndex) => {
    setSliderSlide(slideIndex);
  }, []);

  const triggerAnimalChange = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      setAnimalChangeCount((prev) => prev + 1);

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 300);
    }
  }, []);

  const updateSection = (sectionId) => {
    setCurrentSection(sectionId);
    setIsIntroSection(sectionId === 'intro');
  };

  const value = {
    currentSection,
    setCurrentSection: updateSection,
    sectionConfig,
    isIntroSection,
    setIsIntroSection,
    carouselSlide,
    updateCarouselSlide,
    sliderSlide,
    updateSliderSlide,
    animalChangeCount,
    triggerAnimalChange,
  };

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

export const useSection = () => useContext(SectionContext);
