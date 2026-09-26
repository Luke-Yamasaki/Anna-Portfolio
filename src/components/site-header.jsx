import {siteStyleAttribute} from '@/lib/site-style'
import styles from './styles/site-header.module.css'

export function SiteHeader({title}) {
  return (
    <header
      className={styles.header}
      data-mode="header"
      data-sanity={siteStyleAttribute('spaceDensity')}
    >
      <p className={styles.title} data-sanity={siteStyleAttribute('displaySize')}>
        {title}
      </p>
    </header>
  )
}
