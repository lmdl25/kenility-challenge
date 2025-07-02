import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import perfectionist from 'eslint-plugin-perfectionist'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'

export default tseslint.config([
  {
    ignores: ['**/dist/', '**/node_modules/', '**/coverage/'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      '@/no-restricted-properties': [
        'error',
        {
          object: 'console',
          property: 'log',
          message: 'Avoid using console.log(). Remove it before committing.',
        },
        {
          object: 'console',
          property: 'warn',
          message: 'Avoid using console.warn(). Remove it before committing.',
        },
        {
          object: 'console',
          property: 'error',
          message: 'Avoid using console.error(). Remove it before committing.',
        },
      ],
      '@typescript-eslint/no-namespace': ['off'],
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'line-length',
          order: 'desc',
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
])
