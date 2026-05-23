/**
 * 认证路由 - JWT 登录/登出
 */
const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const { userStore } = require('../stores/user');

const router = new Router({ prefix: '/api/auth' });

const JWT_SECRET = process.env.JWT_SECRET || 'react_next_jwt_secret_2025';
const JWT_EXPIRES_IN = '2h';

const ok = (data) => ({ code: 0, data, message: 'ok' });
const fail = (message, code = 1) => ({ code, data: null, message });

/**
 * POST /api/auth/login
 * body: { username, password }
 */
router.post('/login', (ctx) => {
  const { username, password } = /** @type {{ username: string, password: string }} */ (ctx.request.body);

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = fail('用户名和密码不能为空');
    return;
  }

  // 根据用户名在内存数据库中查找用户
  const users = userStore.list({ keyword: username });
  const user = users.find((u) => u.name === username);

  if (!user) {
    ctx.status = 401;
    ctx.body = fail('用户名或密码错误');
    return;
  }

  // 演示用：统一密码为 123456，实际应使用 bcrypt 比对
  if (password !== '123456') {
    ctx.status = 401;
    ctx.body = fail('用户名或密码错误');
    return;
  }

  // 签发 JWT
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  ctx.body = ok({
    token,
    user: { id: user.id, name: user.name, role: user.role },
  });
});

/**
 * GET /api/auth/me - 获取当前用户信息（需携带 token）
 */
router.get('/me', (ctx) => {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = fail('未提供认证令牌');
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.body = ok({ id: decoded.id, name: decoded.name, role: decoded.role });
  } catch (err) {
    ctx.status = 401;
    ctx.body = fail('令牌无效或已过期');
  }
});

module.exports = router;
