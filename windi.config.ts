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

  gray: {
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
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
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
    300: 'var(--success-300)',
    400: 'var(--success-400)',
    500: 'var(--success-500)',
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
