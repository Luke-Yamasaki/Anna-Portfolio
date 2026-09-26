import {createDataAttribute, stegaClean} from 'next-sanity'
import {fontStack} from './fonts'

const SPACE_DENSITY = {
  compact: {inset: '0.65rem', gap: '1.75rem'},
  regular: {inset: '1rem', gap: '3rem'},
  relaxed: {inset: '1.5rem', gap: '4rem'},
  loose: {inset: '2.25rem', gap: '5.5rem'},
}

const TYPE_SIZE = {
  display: {
    small: '1.75rem',
    regular: '2.5rem',
    large: '3.25rem',
    extraLarge: '4rem',
  },
  title: {
    small: '1.25rem',
    regular: '2rem',
    large: '2.5rem',
    extraLarge: '3rem',
  },
  body: {
    small: '0.875rem',
    regular: '1rem',
    large: '1.125rem',
    extraLarge: '1.25rem',
  },
}

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const DEFAULTS = {
  displayFont: 'orpheus-pro',
  bodyFont: 'adobe-garamond-pro',
  displaySize: 'regular',
  titleSize: 'regular',
  bodySize: 'regular',
  spaceDensity: 'regular',
  paper: '#f4f3ee',
  ink: '#141414',
}

function pickSize(scale, value, fallback) {
  const key = stegaClean(value) || fallback
  return scale[key] || scale[fallback]
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
    '--type-display-size': pickSize(TYPE_SIZE.display, style?.displaySize, DEFAULTS.displaySize),
    '--type-title-size': pickSize(TYPE_SIZE.title, style?.titleSize, DEFAULTS.titleSize),
    '--type-body-size': pickSize(TYPE_SIZE.body, style?.bodySize, DEFAULTS.bodySize),
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
