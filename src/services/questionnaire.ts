/**
 * 问卷服务层
 *
 * 业务页面统一通过此文件调用问卷相关接口。
 *
 * 是否启用 mock 由环境变量 REACT_APP_USE_MOCK 控制：
 *   - 开发环境（.env.development）默认 true → 走 mockjs
 *   - 测试 / 生产环境（.env.test / .env.production）默认 false → 走真实接口
 *   - 也可在本地 .env.development.local 中临时覆盖
 */
import { mockApi } from '../mocks/questionnaire';
import type {
  Questionnaire,
  QuestionnaireInput,
  QueryParams,
  QuestionnaireStatus,
} from '../mocks/questionnaire';

// 仅当显式为 'true' 时启用 mock，避免误开
const useMock = process.env.REACT_APP_USE_MOCK === 'true';
const apiBase = (process.env.REACT_APP_API_BASE_URL ?? '').replace(/\/$/, '');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info(
    `[questionnaire] API mode: ${useMock ? 'MOCK (mockjs)' : `REAL (${apiBase || '<base url not set>'})`} ` +
      `(REACT_APP_USE_MOCK=${process.env.REACT_APP_USE_MOCK ?? 'undefined'})`,
  );
}

// 后端统一响应结构：{ code, data, message }
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiBase) {
    throw new Error('REACT_APP_API_BASE_URL 未配置，无法调用真实接口');
  }
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    ...init,
  });
  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    // ignore parse error
  }
  if (!res.ok || !payload || payload.code !== 0) {
    throw new Error(payload?.message || `请求失败 (${res.status})`);
  }
  return payload.data;
}

const buildQuery = (params: QueryParams): string => {
  const usp = new URLSearchParams();
  if (params.keyword) usp.set('keyword', params.keyword);
  if (params.status && params.status !== 'all') usp.set('status', params.status);
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
};

// 真实接口实现（对接 server/ 中的 Koa 服务）
const realApi = {
  list: (params: QueryParams) =>
    request<Questionnaire[]>(`/api/questionnaires${buildQuery(params)}`),
  create: (input: QuestionnaireInput) =>
    request<Questionnaire>('/api/questionnaires', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: QuestionnaireInput) =>
    request<Questionnaire>(`/api/questionnaires/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ success: true }>(`/api/questionnaires/${id}`, {
      method: 'DELETE',
    }),
};

const api = useMock ? mockApi : realApi;

export const fetchQuestionnaires = (params?: QueryParams): Promise<Questionnaire[]> =>
  api.list(params ?? {});

export const createQuestionnaire = (input: QuestionnaireInput): Promise<Questionnaire> =>
  api.create(input);

export const updateQuestionnaire = (
  id: string,
  input: QuestionnaireInput,
): Promise<Questionnaire> => api.update(id, input);

export const removeQuestionnaire = (id: string): Promise<{ success: true }> => api.remove(id);

export type { Questionnaire, QuestionnaireInput, QueryParams, QuestionnaireStatus };
