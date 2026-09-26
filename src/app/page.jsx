import {HeroCarousel} from '@/components/hero-carousel'
import {SelectedWork} from '@/components/selected-work'
import {SiteFooter} from '@/components/site-footer'
import {SiteHeader} from '@/components/site-header'
import {mapFeaturedStills, mapWorks} from '@/lib/home-page'
import {client} from '@/sanity/client'
import {imageUrl} from '@/sanity/image'
import {HOME_PAGE_QUERY} from '@/sanity/queries'
import styles from '@/components/styles/home-page.module.css'

const options = {next: {revalidate: 30}}

export default async function HomePage() {
  const data = await client.fetch(HOME_PAGE_QUERY, {}, options)
  const slides = mapFeaturedStills(data?.featuredStills)
  const works = mapWorks(data?.works)

  return (
    <>
      <SiteHeader title={data?.siteTitle || 'ANNA KURIHARA'} />
      <main id="main" className={styles.main}>
        <h1 className={styles.pageTitle}>{data?.pageTitle || 'Portfolio'}</h1>
        <HeroCarousel slides={slides} />
        <SelectedWork works={works} />
      </main>
      <SiteFooter
        bio={data?.bio}
        portraitSrc={imageUrl(data?.portrait, 900)}
        portraitAlt={data?.portrait?.alt || 'Anna Kurihara'}
        contactEmail={data?.contactEmail}
      />
    </>
  )
}
