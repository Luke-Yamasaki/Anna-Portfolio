import styles from './styles/site-footer.module.css'

export function SiteFooter({bio, portraitSrc, portraitAlt, contactEmail}) {
  return (
    <footer className={styles.footer}>
      {bio ? <p className={styles.bio}>{bio}</p> : <div />}
      <div className={styles.aside}>
        {portraitSrc ? (
          <img className={styles.portrait} src={portraitSrc} alt={portraitAlt || ''} />
        ) : null}
        {contactEmail ? (
          <a className={styles.contact} href={`mailto:${contactEmail}`}>
            Contact me
          </a>
        ) : null}
      </div>
    </footer>
  )
}
