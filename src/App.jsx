import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MobileProvider } from './contexts/MobileContext';
import { OrientationProvider } from './contexts/OrientationContext'; // Импорт
import { SectionProvider } from './contexts/SectionContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Loader from './components/Loader/Loader';
import './App.scss';

import Header from './components/Header/Header';

const Home = lazy(() => import('./pages/Home'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

export default function App() {
  return (
    <MobileProvider>
      <OrientationProvider>
        {' '}
        {/* Добавляем провайдер */}
        <SectionProvider>
          <NavigationProvider>
            <Suspense fallback={<Loader aria-label="Загрузка приложения" />}>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/information" element={<PrivacyPolicy />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </NavigationProvider>
        </SectionProvider>
      </OrientationProvider>
    </MobileProvider>
  );
}
