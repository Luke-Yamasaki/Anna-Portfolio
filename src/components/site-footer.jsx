import {stegaClean} from 'next-sanity'
import {siteStyleAttribute} from '@/lib/site-style'
import styles from './styles/site-footer.module.css'

export function SiteFooter({bio, portraitSrc, portraitAlt, contactEmail}) {
  const email = stegaClean(contactEmail)

  return (
    <footer
      className={styles.footer}
      data-mode="footer"
      data-sanity={siteStyleAttribute('spaceDensity')}
    >
      {bio ? <p className={styles.bio}>{bio}</p> : <div />}
      <div className={styles.aside}>
        {portraitSrc ? (
          <img className={styles.portrait} src={portraitSrc} alt={portraitAlt || ''} />
        ) : null}
        {email ? (
          <a className={styles.contact} href={`mailto:${email}`}>
            Contact me
          </a>
        ) : null}
      </div>
    </footer>
  )
}
