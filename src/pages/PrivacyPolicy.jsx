import { Helmet } from 'react-helmet';
import Information from '../components/Information/Information';

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Политика конфиденциальности | Канон перемен</title>
        <meta name="description" content="Политика конфиденциальности, TamTam Мой милый питомец" />
        <meta name="keywords" content="политика конфиденциальности, TamTam Мой милый питомец" />
        {/* Open Graph */}
        <meta property="og:title" content="Политика конфиденциальности | TamTam Мой милый питомец" />
        <meta property="og:description" content="Политика конфиденциальности  TamTam Мой милый питомец" />
        <meta property="og:url" content="https://xenabit.github.io/tam-tam-prod/information" />
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Политика конфиденциальности | TamTam Мой милый питомец',
            description: 'Политика конфиденциальности, TamTam Мой милый питомец',
            url: 'https://xenabit.github.io/tam-tam-prod/information',
            image: '/preview-image.jpg',
            publisher: {
              '@type': 'Organization',
              name: 'LABA',
              logo: {
                '@type': 'ImageObject',
                url: 'https://xenabit.github.io/tam-tam-prod/logo.svg',
              },
            },
          })}
        </script>
        {/* Content-Security-Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; img-src 'self' https://iching.laba-laba.ru https://mc.yandex.ru data:; script-src 'self' https://mc.yandex.ru 'sha256-GylAe+ymyzx4MREH3q81FRQ39P6rjlCCFoz0YjMxgVc='; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://mc.yandex.ru https://api.yourdomain.com; frame-src 'self' https://mc.yandex.ru;"
        />
      </Helmet>
      <main>
        <Information />
      </main>
    </>
  );
}

export default PrivacyPolicy;
