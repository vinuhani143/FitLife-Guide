export const palette = {
  light: {
    bg: '#F3F6F5',
    card: '#FFFFFF',
    text: '#12221E',
    muted: '#5B6B66',
    border: '#D7E2DE',
    primary: '#0F766E',
    primarySoft: '#D7F3EF',
    accent: '#0E7490',
    warning: '#B45309',
    danger: '#B91C1C',
    success: '#047857',
    tab: '#0F766E',
    chart: '#0F766E',
  },
  dark: {
    bg: '#0B1210',
    card: '#15201C',
    text: '#E7F0EC',
    muted: '#9AAEA7',
    border: '#2A3A35',
    primary: '#2DD4BF',
    primarySoft: '#134E4A',
    accent: '#67E8F9',
    warning: '#FBBF24',
    danger: '#F87171',
    success: '#34D399',
    tab: '#2DD4BF',
    chart: '#2DD4BF',
  },
};

export type ThemeColors = typeof palette.light;
