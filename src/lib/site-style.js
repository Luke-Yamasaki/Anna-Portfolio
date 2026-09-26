import {createDataAttribute, stegaClean} from 'next-sanity'

const FONT_STACKS = {
  'orpheus-pro': '"orpheus-pro", Georgia, serif',
  'adobe-garamond-pro': '"adobe-garamond-pro", Georgia, serif',
}

const SPACE_DENSITY = {
  compact: {inset: '0.65rem', gap: '1.75rem'},
  regular: {inset: '1rem', gap: '3rem'},
  relaxed: {inset: '1.5rem', gap: '4rem'},
  loose: {inset: '2.25rem', gap: '5.5rem'},
}

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const DEFAULTS = {
  displayFont: 'orpheus-pro',
  bodyFont: 'adobe-garamond-pro',
  spaceDensity: 'regular',
  paper: '#f4f3ee',
  ink: '#141414',
}

function fontStack(value, fallback) {
  const key = stegaClean(value) || fallback
  return FONT_STACKS[key] || FONT_STACKS[fallback]
}

function density(value) {
  const key = stegaClean(value) || DEFAULTS.spaceDensity
  return SPACE_DENSITY[key] || SPACE_DENSITY.regular
}

function hexColor(value, fallback) {
  const color = stegaClean(value) || fallback
  return HEX_COLOR.test(color) ? color : fallback
}

export function siteStyleVars(style) {
  const space = density(style?.spaceDensity)
  return {
    '--font-display': fontStack(style?.displayFont, DEFAULTS.displayFont),
    '--font-body': fontStack(style?.bodyFont, DEFAULTS.bodyFont),
    '--space-inset': space.inset,
    '--space-gap': space.gap,
    '--paper': hexColor(style?.paper, DEFAULTS.paper),
    '--ink': hexColor(style?.ink, DEFAULTS.ink),
  }
}

export function siteStyleAttribute(path) {
  return createDataAttribute({
    id: 'siteStyle',
    type: 'siteStyle',
    path,
  }).toString()
}
