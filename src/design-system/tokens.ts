export const dsColors = {
  page: '#06030a',
  surface: '#100b18',
  surfaceMuted: '#191122',
  text: '#f4f1e8',
  muted: '#b7adbf',
  border: '#5b4b70',
  primary: '#a78bfa',
  primaryStrong: '#c4b5fd',
  accent: '#b7a8cf',
  danger: '#d45f5f',
  dangerSurface: '#351f21',
  successSurface: '#1b2f24',
  warningSurface: '#33291a',
} as const

export const dsRadii = {
  sm: '6px',
  md: '8px',
  pill: '999px',
} as const

export const dsShadows = {
  panel: '0 22px 56px rgba(0, 0, 0, 0.34)',
} as const

export const dsQuasarBrand = {
  primary: dsColors.primary,
  secondary: '#9d8fb4',
  accent: dsColors.accent,
  dark: '#06030a',
  positive: dsColors.primary,
  negative: dsColors.danger,
  info: '#b7a8cf',
  warning: dsColors.accent,
} as const

export type DsButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

export const dsButtonVariants: Record<
  DsButtonVariant,
  {
    color: string
    textColor: string
    flat?: boolean
    outline?: boolean
    unelevated?: boolean
  }
> = {
  primary: {
    color: 'primary',
    textColor: 'dark',
    unelevated: true,
  },
  secondary: {
    color: 'primary',
    textColor: 'primary',
    outline: true,
  },
  danger: {
    color: 'negative',
    textColor: 'white',
    unelevated: true,
  },
  ghost: {
    color: 'primary',
    textColor: 'primary',
    flat: true,
  },
}
