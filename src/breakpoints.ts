export const BREAKPOINTS = {
  lg: 1200,
  md: 768,
  sm: 0,
} as const

export const COLS = {
  lg: 12,
  md: 8,
  sm: 4,
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

export const BREAKPOINT_KEYS: BreakpointKey[] = ['lg', 'md', 'sm']
