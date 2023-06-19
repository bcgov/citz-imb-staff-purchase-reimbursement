module.exports = {
  globals: {
    module: 'readonly',
  },
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    // By extending from a plugin config, we can get recommended rules without having to add them manually.
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'eslint-config-prettier',
  ],
  plugins: ['prettier'],
  settings: {
    // Tells eslint how to resolve imports.
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Override ones from the extended configs.
    '@typescript-eslint/no-non-null-assertion': 'off', // Allow use of non-null assertion operator (!).
    '@typescript-eslint/no-explicit-any': 'warn', // Warn if 'any' type is used.
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false, // Allow use of the 'Function' type.
        },
        extendDefaults: true,
      },
    ],
    'import/no-absolute-path': 'off',
    'sort-imports': 'off',
    'import/order': 'off',
    'no-lonely-if': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'object-curly-newline': 'off',
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-else-return': 'off',
  },
  ignorePatterns: ['node_modules/', 'package-lock.json', 'dist/', 'tests/'],
};
