module.exports = {
  root: true,

  env: {
    es2021: true,
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-cycle': 'off',
    'prefer-destructuring': 'off',
    'camelcase': 'off',
    'quote-props': 'off',
    'max-len': ['error', 150, 2, {
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreUrls: true,
      ignorePattern: 'd="([\\s\\S]*?)"',
    }],
    'no-param-reassign': [2, { 'props': false }],
    'object-curly-newline': 'off',
    'arrow-body-style': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'no-nested-ternary': 'off',
    'no-lonely-if': 'off',
    'dot-notation': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': ['error', { 'functions': false }],
    'vuejs-accessibility/anchor-has-content': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-underscore-dangle': 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],

  settings: {
    'import/extensions': [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.vue'],
      },
    },
  },

  ignorePatterns: ['src/components/qrcode/*'],
};
