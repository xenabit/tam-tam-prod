import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <section className={styles.Loader}>
      <div className={styles.Loader__spinner}></div>
    </section>
  );
}
