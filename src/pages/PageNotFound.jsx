import { Helmet } from 'react-helmet';
import ErrorLayout from '../components/ErrorLayout/ErrorLayout';

function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Страница не найдена | Канон перемен</title>
        <meta name="description" content="Страница не найдена. Вернитесь на главную страницу И-Цзин." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <main>
        <ErrorLayout />
      </main>
    </>
  );
}

export default PageNotFound;
