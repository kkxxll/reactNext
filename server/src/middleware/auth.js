/**
 * JWT 验证中间件
 *
 * 用于保护需要登录才能访问的接口。
 * 使用方式：router.get('/protected', jwtAuth, handler)
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'react_next_jwt_secret_2025';

/**
 * Koa 中间件：验证 Authorization: Bearer <token>
 */
const jwtAuth = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, data: null, message: '未提供认证令牌' };
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // 将用户信息挂载到 ctx.state.user 上，后续中间件/路由可用
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { code: 401, data: null, message: '令牌无效或已过期' };
  }
};

module.exports = { jwtAuth };
