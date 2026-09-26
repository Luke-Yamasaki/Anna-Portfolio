import {stegaClean} from 'next-sanity'

export const FONT_CATALOG = [
  {title: 'Orpheus Pro', value: 'orpheus-pro', source: 'typekit', fallback: 'serif'},
  {title: 'Adobe Garamond Pro', value: 'adobe-garamond-pro', source: 'typekit', fallback: 'serif'},
  {title: 'Abril Fatface', value: 'Abril Fatface', source: 'google', fallback: 'serif'},
  {title: 'Alegreya', value: 'Alegreya', source: 'google', fallback: 'serif'},
  {title: 'Archivo', value: 'Archivo', source: 'google', fallback: 'sans-serif'},
  {title: 'Bitter', value: 'Bitter', source: 'google', fallback: 'serif'},
  {title: 'Bodoni Moda', value: 'Bodoni Moda', source: 'google', fallback: 'serif'},
  {title: 'Cardo', value: 'Cardo', source: 'google', fallback: 'serif'},
  {title: 'Cinzel', value: 'Cinzel', source: 'google', fallback: 'serif'},
  {title: 'Cormorant', value: 'Cormorant', source: 'google', fallback: 'serif'},
  {title: 'Cormorant Garamond', value: 'Cormorant Garamond', source: 'google', fallback: 'serif'},
  {title: 'Crimson Pro', value: 'Crimson Pro', source: 'google', fallback: 'serif'},
  {title: 'DM Sans', value: 'DM Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Domine', value: 'Domine', source: 'google', fallback: 'serif'},
  {title: 'EB Garamond', value: 'EB Garamond', source: 'google', fallback: 'serif'},
  {title: 'Figtree', value: 'Figtree', source: 'google', fallback: 'sans-serif'},
  {title: 'Fraunces', value: 'Fraunces', source: 'google', fallback: 'serif'},
  {title: 'Gilda Display', value: 'Gilda Display', source: 'google', fallback: 'serif'},
  {title: 'IBM Plex Sans', value: 'IBM Plex Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'IBM Plex Serif', value: 'IBM Plex Serif', source: 'google', fallback: 'serif'},
  {title: 'Instrument Sans', value: 'Instrument Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Instrument Serif', value: 'Instrument Serif', source: 'google', fallback: 'serif'},
  {title: 'Inter', value: 'Inter', source: 'google', fallback: 'sans-serif'},
  {title: 'Italiana', value: 'Italiana', source: 'google', fallback: 'serif'},
  {title: 'Josefin Sans', value: 'Josefin Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Josefin Slab', value: 'Josefin Slab', source: 'google', fallback: 'serif'},
  {title: 'Jost', value: 'Jost', source: 'google', fallback: 'sans-serif'},
  {title: 'Karla', value: 'Karla', source: 'google', fallback: 'sans-serif'},
  {title: 'Lato', value: 'Lato', source: 'google', fallback: 'sans-serif'},
  {title: 'Libre Baskerville', value: 'Libre Baskerville', source: 'google', fallback: 'serif'},
  {title: 'Libre Franklin', value: 'Libre Franklin', source: 'google', fallback: 'sans-serif'},
  {title: 'Literata', value: 'Literata', source: 'google', fallback: 'serif'},
  {title: 'Lora', value: 'Lora', source: 'google', fallback: 'serif'},
  {title: 'Manrope', value: 'Manrope', source: 'google', fallback: 'sans-serif'},
  {title: 'Marcellus', value: 'Marcellus', source: 'google', fallback: 'serif'},
  {title: 'Merriweather', value: 'Merriweather', source: 'google', fallback: 'serif'},
  {title: 'Montserrat', value: 'Montserrat', source: 'google', fallback: 'sans-serif'},
  {title: 'Newsreader', value: 'Newsreader', source: 'google', fallback: 'serif'},
  {title: 'Noto Serif', value: 'Noto Serif', source: 'google', fallback: 'serif'},
  {title: 'Noto Serif Display', value: 'Noto Serif Display', source: 'google', fallback: 'serif'},
  {title: 'Nunito Sans', value: 'Nunito Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Old Standard TT', value: 'Old Standard TT', source: 'google', fallback: 'serif'},
  {title: 'Open Sans', value: 'Open Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Oranienbaum', value: 'Oranienbaum', source: 'google', fallback: 'serif'},
  {title: 'Outfit', value: 'Outfit', source: 'google', fallback: 'sans-serif'},
  {title: 'Oswald', value: 'Oswald', source: 'google', fallback: 'sans-serif'},
  {title: 'PT Serif', value: 'PT Serif', source: 'google', fallback: 'serif'},
  {title: 'Petrona', value: 'Petrona', source: 'google', fallback: 'serif'},
  {title: 'Philosopher', value: 'Philosopher', source: 'google', fallback: 'sans-serif'},
  {title: 'Playfair Display', value: 'Playfair Display', source: 'google', fallback: 'serif'},
  {title: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Poppins', value: 'Poppins', source: 'google', fallback: 'sans-serif'},
  {title: 'Prata', value: 'Prata', source: 'google', fallback: 'serif'},
  {title: 'Raleway', value: 'Raleway', source: 'google', fallback: 'sans-serif'},
  {title: 'Roboto Serif', value: 'Roboto Serif', source: 'google', fallback: 'serif'},
  {title: 'Source Sans 3', value: 'Source Sans 3', source: 'google', fallback: 'sans-serif'},
  {title: 'Source Serif 4', value: 'Source Serif 4', source: 'google', fallback: 'serif'},
  {title: 'Space Grotesk', value: 'Space Grotesk', source: 'google', fallback: 'sans-serif'},
  {title: 'Spectral', value: 'Spectral', source: 'google', fallback: 'serif'},
  {title: 'Syne', value: 'Syne', source: 'google', fallback: 'sans-serif'},
  {title: 'Tenor Sans', value: 'Tenor Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Unna', value: 'Unna', source: 'google', fallback: 'serif'},
  {title: 'Vollkorn', value: 'Vollkorn', source: 'google', fallback: 'serif'},
  {title: 'Work Sans', value: 'Work Sans', source: 'google', fallback: 'sans-serif'},
  {title: 'Yeseva One', value: 'Yeseva One', source: 'google', fallback: 'serif'},
  {title: 'Young Serif', value: 'Young Serif', source: 'google', fallback: 'serif'},
  {title: 'Zilla Slab', value: 'Zilla Slab', source: 'google', fallback: 'serif'},
]

const LOCAL_STACKS = {
  'orpheus-pro': '"orpheus-pro", Georgia, serif',
  'adobe-garamond-pro': '"adobe-garamond-pro", Georgia, serif',
}

const byValue = new Map(FONT_CATALOG.map((font) => [font.value, font]))

export function fontStack(value, fallbackValue) {
  const key = stegaClean(value) || fallbackValue
  const font = byValue.get(key) || byValue.get(fallbackValue)
  if (!font) return 'Georgia, serif'
  if (font.source === 'typekit') return LOCAL_STACKS[font.value]
  return `"${font.value}", Georgia, ${font.fallback}`
}

export function googleFontsHref(values) {
  const families = [
    ...new Set(
      values
        .map((value) => stegaClean(value))
        .map((value) => byValue.get(value))
        .filter((font) => font?.source === 'google')
        .map((font) => font.value),
    ),
  ]

  if (!families.length) return ''

  const query = families
    .map((family) => `family=${family.replaceAll(' ', '+')}:ital,wght@0,400..800;1,400..800`)
    .join('&')

  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

export const FONT_FIELD_OPTIONS = FONT_CATALOG.map(({title, value}) => ({title, value}))
