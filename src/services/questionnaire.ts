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

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info(
    `[questionnaire] API mode: ${useMock ? 'MOCK (mockjs)' : 'REAL'} ` +
      `(REACT_APP_USE_MOCK=${process.env.REACT_APP_USE_MOCK ?? 'undefined'})`,
  );
}

// 真实接口预留（示例占位，未启用时不会执行）
const realApi = {
  list: (_params: QueryParams) => Promise.reject(new Error('Real API not implemented')),
  create: (_input: QuestionnaireInput) => Promise.reject(new Error('Real API not implemented')),
  update: (_id: string, _input: QuestionnaireInput) =>
    Promise.reject(new Error('Real API not implemented')),
  remove: (_id: string) => Promise.reject(new Error('Real API not implemented')),
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
