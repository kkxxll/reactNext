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
import http from '../utils/request';
import type { ApiResponse } from '../utils/request';
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
    `[questionnaire] API mode: ${useMock ? 'MOCK (mockjs)' : 'REAL (axios)'} ` +
      `(REACT_APP_USE_MOCK=${process.env.REACT_APP_USE_MOCK ?? 'undefined'})`,
  );
}

// 真实接口实现（基于 axios 拦截器，自动处理 token、错误提示）
const realApi = {
  getById: async (id: string): Promise<Questionnaire> => {
    const res = await http.get<ApiResponse<Questionnaire>>(`/api/questionnaires/${id}`);
    return res.data.data;
  },

  list: async (params: QueryParams): Promise<Questionnaire[]> => {
    const res = await http.get<ApiResponse<Questionnaire[]>>('/api/questionnaires', { params });
    return res.data.data;
  },

  create: async (input: QuestionnaireInput): Promise<Questionnaire> => {
    const res = await http.post<ApiResponse<Questionnaire>>('/api/questionnaires', input);
    return res.data.data;
  },

  update: async (id: string, input: QuestionnaireInput): Promise<Questionnaire> => {
    const res = await http.put<ApiResponse<Questionnaire>>(`/api/questionnaires/${id}`, input);
    return res.data.data;
  },

  remove: async (id: string): Promise<{ success: true }> => {
    const res = await http.delete<ApiResponse<{ success: true }>>(`/api/questionnaires/${id}`);
    return res.data.data;
  },
};

const api = useMock ? mockApi : realApi;

export const fetchQuestionnaireById = (id: string): Promise<Questionnaire> =>
  api.getById(id);

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
