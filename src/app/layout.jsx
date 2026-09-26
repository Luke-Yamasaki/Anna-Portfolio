import './globals.css'
import styles from './layout.module.css'

export const metadata = {
  title: 'Anna Kurihara',
  icons: {
    icon: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        <a className={styles.skipLink} href="#main">
          Skip to main
        </a>
        {children}
      </body>
    </html>
  )
}
