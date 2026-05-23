/**
 * 用户模块路由
 */
const Router = require('@koa/router');
const { userStore } = require('../stores/user');

const router = new Router({ prefix: '/api/users' });

const ok = (data) => ({ code: 0, data, message: 'ok' });
const fail = (message, code = 1) => ({ code, data: null, message });

// 列表
router.get('/', (ctx) => {
  const { keyword, role, status } = ctx.query;
  const list = userStore.list({ keyword, role, status });
  ctx.body = ok(list);
});

// 新建
router.post('/', (ctx) => {
  const { error, data } = userStore.create(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = fail(error);
    return;
  }
  ctx.status = 201;
  ctx.body = ok(data);
});

// 更新
router.put('/:id', (ctx) => {
  const { id } = ctx.params;
  const result = userStore.update(id, ctx.request.body);
  if (result.error) {
    ctx.status = result.notFound ? 404 : 400;
    ctx.body = fail(result.error);
    return;
  }
  ctx.body = ok(result.data);
});

// 删除
router.delete('/:id', (ctx) => {
  const { id } = ctx.params;
  const result = userStore.remove(id);
  if (result.error) {
    ctx.status = result.notFound ? 404 : 400;
    ctx.body = fail(result.error);
    return;
  }
  ctx.body = ok(result.data);
});

module.exports = router;
