import { defineConfig } from 'windicss/helpers';
import colors from 'windicss/colors';

const designColors = {
  'gray-light': 'var(--gray-light)',
  'toast-default': 'var(--toast-default)',
  'toast-info': 'var(--toast-info)',
  'toast-success': 'var(--toast-success)',
  'toast-error': 'var(--toast-error)',
  'toast-warning': 'var(--toast-warning)',
  'body-bg': 'var(--body-bg)',
  'body-color': 'var(--body-color)',
  'card-border-color': 'var(--card-border-color)',
  'card-title-color': 'var(--card-title-color)',
  'logo-item-color': 'var(--logo-item-color)',
  'dark-gray': 'var(--dark-gray)',
  'md-gray': 'var(--md-gray)',
  'l-gray': 'var(--l-gray)',
  's-gray': 'var(--s-gray)',
  'x-gray': 'var(--x-gray)',

  blue: {
    10: 'var(--blue-10)',
    20: 'var(--blue-20)',
    50: 'var(--blue-50)',
    100: 'var(--blue-100)',
    200: 'var(--blue-200)',
    300: 'var(--blue-300)',
    400: 'var(--blue-400)',
  },
  gray: {
    50: 'var(--gray-50)',
    100: 'var(--gray-100)',
    200: 'var(--gray-200)',
    300: 'var(--gray-300)',
    400: 'var(--gray-400)',
    500: 'var(--gray-500)',
    600: 'var(--gray-600)',
  },
  primary: {
    50: 'var(--primary-50)',
    100: 'var(--primary-100)',
    500: 'var(--primary-500)',
    600: 'var(--primary-600)',
  },
  secondary: {
    100: 'var(--secondary-100)',
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
    700: 'var(--secondary-700)',
    800: 'var(--secondary-800)',
    900: 'var(--secondary-900)',
  },
  danger: {
    100: 'var(--danger-100)',
    200: 'var(--danger-200)',
    300: 'var(--danger-300)',
    400: 'var(--danger-400)',
    500: 'var(--danger-500)',
  },
  success: {
    100: 'var(--success-100)',
    200: 'var(--success-200)',
    250: 'var(--success-250)',
    300: 'var(--success-300)',
    400: 'var(--success-400)',
    500: 'var(--success-500)',
    600: 'var(--success-600)',
  },
  warning: {
    100: 'var(--warning-100)',
    200: 'var(--warning-200)',
    300: 'var(--warning-300)',
    400: 'var(--warning-400)',
    500: 'var(--warning-500)',
  },
};

export default defineConfig({
  theme: {
    colors: {
      ...colors,
      ...designColors,
    },
    extend: {
      screens: {
        'h-sm': { 'raw': '(max-height: 849px) and (min-width: 1024px)' },
        'h-md': { 'raw': '(max-height: 1023px) and (min-width: 1024px)' },
        'phone': '320px',
        'phone-lg': '480px',
        'tablet': '768px',
        'laptop': '1024px',
        'laptop-lg': '1180px',
        'desktop-sm': '1380px',
        'desktop': '1440px',
        'desktop-lg': '1600px',
      },
      boxShadow: {
        'basic': 'var(--box-shadow-basic)',
        'medium': 'var(--box-shadow-medium)',
      },
    },
  },
  extract: {
    include: ['**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git', 'dist'],
  },
});
