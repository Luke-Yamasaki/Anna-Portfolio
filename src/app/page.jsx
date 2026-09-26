import {HeroCarousel} from '@/components/hero-carousel'
import {SelectedWork} from '@/components/selected-work'
import {SiteFooter} from '@/components/site-footer'
import {SiteHeader} from '@/components/site-header'
import {client} from '@/sanity/client'
import {urlFor} from '@/sanity/image'
import {HOME_PAGE_QUERY} from '@/sanity/queries'
import styles from '@/components/home-page.module.css'

const options = {next: {revalidate: 30}}

function imageUrl(image, width) {
  if (!image?.asset) return ''
  return urlFor(image).width(width).url()
}

export default async function HomePage() {
  const data = await client.fetch(HOME_PAGE_QUERY, {}, options)

  const slides = (data?.featuredStills ?? [])
    .map((still) => ({
      key: still._key,
      src: imageUrl(still.image, 800),
      alt: still.image?.alt || '',
    }))
    .filter((slide) => slide.src)

  const works = (data?.works ?? [])
    .map((work, index) => {
      const type = work.mediaType === 'video' ? 'video' : 'image'
      const playbackId =
        work.video?.asset?.status === 'ready' ? work.video.asset.playbackId : ''
      const src = type === 'video' ? work.videoUrl : imageUrl(work.image, 1400)
      if (type === 'video' ? !playbackId && !src : !src) return null
      return {
        id: work._id,
        index,
        type,
        src,
        playbackId,
        poster: imageUrl(work.poster, 1400),
        label: work.label,
        description: work.description,
      }
    })
    .filter(Boolean)

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
