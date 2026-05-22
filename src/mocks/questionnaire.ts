/**
 * 问卷模块 Mock 数据与接口
 *
 * 基于 mockjs 生成模拟数据，并通过 Promise + setTimeout 模拟网络延时。
 * 数据保存在模块级变量中，刷新页面会重置为初始随机数据。
 */
import Mock, { Random } from 'mockjs';

export type QuestionnaireStatus = 'draft' | 'published' | 'closed';

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  status: QuestionnaireStatus;
  createdAt: string;
}

export interface QueryParams {
  keyword?: string;
  status?: QuestionnaireStatus | 'all';
}

export type QuestionnaireInput = Omit<Questionnaire, 'id' | 'createdAt'>;

// ------------------- mockjs 模板：批量生成初始数据 -------------------

interface MockItem {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  status: QuestionnaireStatus;
  createdAt: string;
}

const generated = Mock.mock({
  'list|12': [
    {
      'id|+1': 1000,
      title: '@ctitle(6, 14)',
      description: '@cparagraph(1, 2)',
      'questionCount|3-30': 1,
      'status|1': ['draft', 'published', 'closed'],
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
}) as { list: MockItem[] };

let db: Questionnaire[] = generated.list.map((item) => ({
  ...item,
  id: String(item.id),
}));

// ------------------- 工具函数 -------------------

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// ------------------- Mock 接口 -------------------

export const mockApi = {
  /** 列表查询（支持关键词与状态筛选） */
  list(params: QueryParams = {}): Promise<Questionnaire[]> {
    const { keyword = '', status = 'all' } = params;
    const result = db.filter((item) => {
      const matchKeyword = keyword.trim() === '' || item.title.includes(keyword.trim());
      const matchStatus = status === 'all' || item.status === status;
      return matchKeyword && matchStatus;
    });
    return delay([...result]);
  },

  /** 新建 */
  create(input: QuestionnaireInput): Promise<Questionnaire> {
    const item: Questionnaire = {
      // 使用 mockjs 生成 id（GUID 简化版）
      id: Random.string('number', 13),
      createdAt: Mock.mock('@now("yyyy-MM-dd HH:mm:ss")') as string,
      ...input,
    };
    db = [item, ...db];
    return delay(item);
  },

  /** 更新 */
  update(id: string, input: QuestionnaireInput): Promise<Questionnaire> {
    const index = db.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.reject(new Error('问卷不存在'));
    }
    const updated: Questionnaire = { ...db[index], ...input };
    db = db.map((item) => (item.id === id ? updated : item));
    return delay(updated);
  },

  /** 删除 */
  remove(id: string): Promise<{ success: true }> {
    const exists = db.some((item) => item.id === id);
    if (!exists) {
      return Promise.reject(new Error('问卷不存在'));
    }
    db = db.filter((item) => item.id !== id);
    return delay({ success: true } as const);
  },
};
