import {imageUrl} from '@/sanity/image'

export function mapFeaturedStills(stills) {
  return (stills ?? [])
    .map((still) => ({
      key: still._key,
      src: imageUrl(still.image, 800),
      alt: still.image?.alt || '',
    }))
    .filter((slide) => slide.src)
}

export function mapWorks(works) {
  return (works ?? [])
    .map((work, index) => {
      const type = work.mediaType === 'video' ? 'video' : 'image'
      const playbackId =
        work.video?.asset?.status === 'ready' ? work.video.asset.playbackId : ''
      const src = type === 'image' ? imageUrl(work.image, 1400) : ''
      if (type === 'video' ? !playbackId : !src) return null
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
}
