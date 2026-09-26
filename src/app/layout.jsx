import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {DisableDraftMode} from '@/components/disable-draft-mode'
import {siteStyleVars} from '@/lib/site-style'
import {SanityLive, sanityFetch} from '@/sanity/live'
import {SITE_STYLE_QUERY} from '@/sanity/queries'
import './globals.css'
import styles from './layout.module.css'

export const metadata = {
  title: 'Anna Kurihara',
  icons: {
    icon: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
}

export default async function RootLayout({children}) {
  const {data: siteStyle} = await sanityFetch({query: SITE_STYLE_QUERY})
  const isDraft = (await draftMode()).isEnabled

  return (
    <html lang="en" data-mode="page" style={siteStyleVars(siteStyle)}>
      <body>
        <a className={styles.skipLink} href="#main">
          Skip to main content
        </a>
        {children}
        <SanityLive includeDrafts={isDraft} />
        {isDraft ? (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        ) : null}
      </body>
    </html>
  )
}
