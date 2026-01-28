import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const rootElement = document.getElementById('root');

// Проверка наличия атрибута data-react-snap
if (rootElement.hasAttribute('data-react-snap')) {
  hydrateRoot(
    rootElement,
    <BrowserRouter basename="/tam-tam-prod/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  );
} else {
  createRoot(rootElement).render(
    <BrowserRouter basename="/tam-tam-prod/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  );
}
