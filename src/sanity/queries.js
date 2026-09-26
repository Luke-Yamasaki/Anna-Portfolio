import {defineQuery} from 'next-sanity'

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    siteTitle,
    pageTitle,
    featuredStills[]{
      _key,
      image
    },
    bio,
    portrait,
    contactEmail,
    works[]->{
      _id,
      label,
      mediaType,
      image,
      poster,
      video {
        asset->{
          playbackId,
          status
        }
      },
      description
    }
  }
`)

export const SITE_STYLE_QUERY = defineQuery(`
  *[_id == "siteStyle"][0]{
    displayFont,
    bodyFont,
    spaceDensity,
    paper,
    ink
  }
`)
