/**
 * 问卷服务层
 *
 * 业务页面统一通过此文件调用问卷相关接口。
 * 当前实现指向 mock，后续接入真实后端时只需在此处切换实现即可。
 */
import { mockApi } from '../mocks/questionnaire';
import type {
  Questionnaire,
  QuestionnaireInput,
  QueryParams,
  QuestionnaireStatus,
} from '../mocks/questionnaire';

const useMock = process.env.REACT_APP_USE_MOCK !== 'false';

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
