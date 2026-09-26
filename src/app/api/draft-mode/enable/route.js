import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/sanity/client'
import {token} from '@/sanity/token'

if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token}),
})
