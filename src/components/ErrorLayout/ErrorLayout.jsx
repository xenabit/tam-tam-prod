import styles from './ErrorLayout.module.scss';
import ErrorImg from '../../assets/images/page-not-found-404.svg';
import { Link } from 'react-router-dom';

function ErrorLayout() {
  return (
    <section className={styles.ErrorLayout}>
      <div className={styles.ErrorLayout__text}>
        <div className={styles.ErrorLayout__num}>
          <h1>404 - Страница не найдена | Канон перемен</h1>
          <img src={ErrorImg} width="671" height="259" alt="404 - Страница не найдена" loading="lazy" />
        </div>
        <p className={styles.ErrorLayout__explain}>К&nbsp;сожалению, страница не&nbsp;найдена</p>
        <p className={styles.ErrorLayout__desc}>Возможно вы&nbsp;неправильно набрали URL&#8209;адрес или страница была&nbsp;удалена</p>
        <Link to="/" onClick={localStorage.setItem('activeTab', '/')} href="#" className={styles.ErrorLayout__button}>
          <span>Перейти на главную</span>
        </Link>
      </div>
    </section>
  );
}

export default ErrorLayout;
