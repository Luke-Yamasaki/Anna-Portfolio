import styles from './styles/site-header.module.css'

export function SiteHeader({title}) {
  return (
    <header className={styles.header}>
      <p className={styles.title}>{title}</p>
    </header>
  )
}
