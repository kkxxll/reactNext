import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  // 1. 基础配置
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error', // 强制 Prettier 格式化
    },
    settings: {
      react: { version: 'detect' },
    },
  },


  // 2. TS 推荐规则
  ...tseslint.configs.recommended,

  // 3. React 推荐规则
  pluginReact.configs.flat.recommended,
];
