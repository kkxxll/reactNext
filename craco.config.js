/**
 * craco 配置
 * 文档：https://craco.js.org/
 *
 * 在不 eject CRA 的前提下扩展 webpack / dev server / jest 等配置。
 */
const path = require('path');

module.exports = {
  // webpack 别名：源码中可用 import x from '@/components/...'
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 开发服务器：把 /api 代理到 Koa 后端（默认 3001）
  // 这样前端可省略 REACT_APP_API_BASE_URL，直接 fetch('/api/xxx')
  devServer: {
    proxy: {
      '/api': {
        target: process.env.PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // jest（test）路径别名同步
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  },
};
