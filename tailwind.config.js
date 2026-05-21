/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  // 禁用 preflight，避免与 antd 的全局样式重置冲突
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
      },
    },
  },
  plugins: [],
};
