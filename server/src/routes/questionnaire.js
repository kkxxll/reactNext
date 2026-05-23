/**
 * 问卷模块路由
 *
 * 统一返回结构：{ code: 0, data, message } 成功；{ code !== 0, message } 失败。
 */
const Router = require('@koa/router');
const { store } = require('../store');

const router = new Router({ prefix: '/api/questionnaires' });

const ok = (data) => ({ code: 0, data, message: 'ok' });
const fail = (message, code = 1) => ({ code, data: null, message });

// 列表
router.get('/', (ctx) => {
  const { keyword, status } = ctx.query;
  const list = store.list({ keyword, status });
  ctx.body = ok(list);
});

// 详情
router.get('/:id', (ctx) => {
  const { id } = ctx.params;
  const result = store.getById(id);
  if (result.error) {
    ctx.status = 404;
    ctx.body = fail(result.error);
    return;
  }
  ctx.body = ok(result.data);
});

// 新建
router.post('/', (ctx) => {
  const { error, data } = store.create(ctx.request.body);
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
  const result = store.update(id, ctx.request.body);
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
  const result = store.remove(id);
  if (result.error) {
    ctx.status = result.notFound ? 404 : 400;
    ctx.body = fail(result.error);
    return;
  }
  ctx.body = ok(result.data);
});

module.exports = router;
