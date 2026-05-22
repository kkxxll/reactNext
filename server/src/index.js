/**
 * Koa 服务入口
 *
 * 启动：
 *   cd server
 *   npm install
 *   npm run dev   # node --watch 自动重启
 *   npm start     # 普通启动
 *
 * 默认监听 3001 端口（避免与 CRA 的 3000 冲突）。
 */
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');

const questionnaireRouter = require('./routes/questionnaire');

const PORT = Number(process.env.PORT) || 3001;
const app = new Koa();

// 全局错误兜底
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      code: err.status || 500,
      data: null,
      message: err.message || 'Internal Server Error',
    };
    // eslint-disable-next-line no-console
    console.error('[server error]', err);
  }
});

// 简易访问日志
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  // eslint-disable-next-line no-console
  console.log(`${ctx.method} ${ctx.url} -> ${ctx.status} (${Date.now() - start}ms)`);
});

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser());

// 健康检查
const rootRouter = new Router();
rootRouter.get('/health', (ctx) => {
  ctx.body = { code: 0, data: { status: 'ok', timestamp: Date.now() }, message: 'ok' };
});

app.use(rootRouter.routes()).use(rootRouter.allowedMethods());
app.use(questionnaireRouter.routes()).use(questionnaireRouter.allowedMethods());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Koa server listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[server] Try: curl http://localhost:${PORT}/api/questionnaires`);
});
