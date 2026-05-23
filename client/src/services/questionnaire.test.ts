import http from '../utils/request';
import { createQuestionnaire } from './questionnaire';
import type { QuestionnaireInput } from './questionnaire';

// mock axios 实例
jest.mock('../utils/request', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// 强制走真实接口（非 mock 模式）
beforeAll(() => {
  process.env.REACT_APP_USE_MOCK = 'false';
});

describe('createQuestionnaire', () => {
  it('应该调用 POST /api/questionnaires 并返回创建结果', async () => {
    const input: QuestionnaireInput = {
      title: '用户满意度调查',
      description: '针对产品体验的简单调查',
      questionCount: 5,
      status: 'draft',
    };

    const mockResponse = {
      data: {
        code: 0,
        data: {
          id: '2001',
          ...input,
          createdAt: '2026-05-23 10:00:00',
        },
        message: 'ok',
      },
    };

    (http.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await createQuestionnaire(input);

    expect(http.post).toHaveBeenCalledWith('/api/questionnaires', input);
    expect(result).toEqual({
      id: '2001',
      title: '用户满意度调查',
      description: '针对产品体验的简单调查',
      questionCount: 5,
      status: 'draft',
      createdAt: '2026-05-23 10:00:00',
    });
  });
});
