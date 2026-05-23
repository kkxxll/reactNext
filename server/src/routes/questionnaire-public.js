/**
 * 问卷公开路由（C 端用，无需 JWT 认证）
 *
 * 提供问卷列表（仅已发布）、详情和提交答案接口。
 */
const Router = require('@koa/router');
const { store, submissionStore } = require('../store');

const router = new Router({ prefix: '/api/c/questionnaires' });

const ok = (data) => ({ code: 0, data, message: 'ok' });
const fail = (message, code = 1) => ({ code, data: null, message });

// 已发布问卷列表
router.get('/', (ctx) => {
  const list = store.list({ status: 'published' });
  ctx.body = ok(list);
});

// 问卷详情
router.get('/:id', (ctx) => {
  const { id } = ctx.params;
  const result = store.getById(id);
  if (result.error) {
    ctx.status = 404;
    ctx.body = fail(result.error);
    return;
  }
  // C 端只能查看已发布的问卷
  if (result.data.status !== 'published') {
    ctx.status = 404;
    ctx.body = fail('问卷不存在或未发布');
    return;
  }
  ctx.body = ok(result.data);
});

// 提交问卷答案
router.post('/:id/submit', (ctx) => {
  const { id } = ctx.params;
  const { answers } = /** @type {{ answers: string[] }} */ (ctx.request.body);

  const result = submissionStore.submit(id, answers);
  if (result.error) {
    ctx.status = result.notFound ? 404 : 400;
    ctx.body = fail(result.error);
    return;
  }
  ctx.status = 201;
  ctx.body = ok(result.data);
});

module.exports = router;
