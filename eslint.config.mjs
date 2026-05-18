import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  // 1. 基础配置
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: { version: "detect" },
    },
  },


  // 2. TS 推荐规则
  ...tseslint.configs.recommended,

  // 3. React 推荐规则
  pluginReact.configs.flat.recommended,
];