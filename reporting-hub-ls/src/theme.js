//main app colors
export const Colors = {
  navy: '#0A3556',
  blue: '#0284C9',
  lightBlue: '#D7E5EE',
  offWhite: '#F8F6F2',
  steel: '#79BBD9',
  white: '#FFFFFF',
  black: '#111111',
  gray: '#6B7280',
  lightGray: '#E5E7EB',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  cardBg: '#FFFFFF',
  screenBg: '#F4F7FB',
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800', color: Colors.navy },
  h2: { fontSize: 22, fontWeight: '700', color: Colors.navy },
  h3: { fontSize: 18, fontWeight: '600', color: Colors.navy },
  h4: { fontSize: 16, fontWeight: '600', color: Colors.navy },
  body: { fontSize: 14, fontWeight: '400', color: Colors.black },
  caption: { fontSize: 12, fontWeight: '400', color: Colors.gray },
  label: { fontSize: 13, fontWeight: '500', color: Colors.gray },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#0A3556',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  strong: {
    shadowColor: '#0A3556',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
