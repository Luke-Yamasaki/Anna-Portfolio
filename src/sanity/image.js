import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

export function imageUrl(image, width) {
  if (!image?.asset) return ''
  return urlFor(image).width(width).url()
}
