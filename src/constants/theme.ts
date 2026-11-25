/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    accent: '#E50914',
    onAccent: '#FFFFFF',
    rating: '#F5A524',
    danger: '#D93036',
    border: '#D9D9E0',
  },
  dark: {
    text: '#EDEEF0',
    background: '#0B0B0F',
    backgroundElement: '#1A1B1F',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    accent: '#FF3B46',
    onAccent: '#FFFFFF',
    rating: '#FFC53D',
    danger: '#FF6369',
    border: '#2E3135',
  },
} as const;

export const Radius = { sm: 8, md: 12, lg: 20, full: 999 } as const;

export const Motion = {
  enter: 320,
  stagger: 45,
  maxStaggerItems: 8,
  press: 120,
  pressScale: 0.96,
  pulse: 800,
  heroInterval: 5000,
} as const;

export const CardSize = { row: 124, topTen: 132, avatar: 84, genre: 148 } as const;

/** Gradient pair and emoji for each TMDB genre id (movie and TV ids). */
export const GenreStyle: Record<number, { colors: [string, string]; icon: string }> = {
  28: { colors: ['#FF512F', '#DD2476'], icon: '💥' },
  12: { colors: ['#F7971E', '#FFD200'], icon: '🧭' },
  16: { colors: ['#00C6FF', '#0072FF'], icon: '🎨' },
  35: { colors: ['#F9D423', '#FF4E50'], icon: '😂' },
  80: { colors: ['#434343', '#000000'], icon: '🕵️' },
  99: { colors: ['#11998E', '#38EF7D'], icon: '🎥' },
  18: { colors: ['#8E2DE2', '#4A00E0'], icon: '🎭' },
  10751: { colors: ['#F857A6', '#FF5858'], icon: '👨‍👩‍👧' },
  14: { colors: ['#7F00FF', '#E100FF'], icon: '🧙' },
  36: { colors: ['#B79891', '#94716B'], icon: '🏛️' },
  27: { colors: ['#870000', '#190A05'], icon: '👻' },
  10402: { colors: ['#FC466B', '#3F5EFB'], icon: '🎵' },
  9648: { colors: ['#232526', '#414345'], icon: '🔍' },
  10749: { colors: ['#EE9CA7', '#FF5E62'], icon: '💘' },
  878: { colors: ['#0F2027', '#2C5364'], icon: '🚀' },
  10770: { colors: ['#536976', '#292E49'], icon: '📺' },
  53: { colors: ['#C31432', '#240B36'], icon: '🔪' },
  10752: { colors: ['#3A6073', '#16222A'], icon: '⚔️' },
  37: { colors: ['#C79081', '#DFA579'], icon: '🤠' },
  10759: { colors: ['#FF512F', '#F09819'], icon: '💥' },
  10762: { colors: ['#43E97B', '#38F9D7'], icon: '🧸' },
  10763: { colors: ['#2B5876', '#4E4376'], icon: '📰' },
  10764: { colors: ['#F2994A', '#F2C94C'], icon: '🎤' },
  10765: { colors: ['#4776E6', '#8E54E9'], icon: '🛸' },
  10766: { colors: ['#DA4453', '#89216B'], icon: '💔' },
  10767: { colors: ['#00B4DB', '#0083B0'], icon: '🎙️' },
  10768: { colors: ['#485563', '#29323C'], icon: '🗳️' },
};

export const DefaultGenreStyle = { colors: ['#485563', '#29323C'] as [string, string], icon: '🎬' };

/** Overlay colours that sit on top of photos, so they stay the same in both themes. */
export const Overlay = {
  scrimStart: 'rgba(0,0,0,0)',
  scrimEnd: 'rgba(0,0,0,0.85)',
  onImage: '#FFFFFF',
  onImageMuted: 'rgba(255,255,255,0.75)',
  dot: 'rgba(255,255,255,0.4)',
  glass: 'rgba(0,0,0,0.45)',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
