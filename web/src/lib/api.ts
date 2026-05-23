/**
 * C 端 API 请求层
 *
 * 使用 fetch 封装，对接 server 的公开问卷接口。
 * 开发环境通过 next.config.ts rewrites 代理到 localhost:3001。
 */

const API_BASE = '/api/c/questionnaires';

/** 获取完整的 API 基础 URL（SSR 时需要绝对地址） */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // 客户端：相对路径，由 next.config rewrites 代理
    return '';
  }
  // 服务端：需要完整 URL
  return process.env.API_SERVER_URL || 'http://localhost:3001';
}

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  questionCount: number;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
}

export interface Submission {
  id: string;
  questionnaireId: string;
  answers: string[];
  submittedAt: string;
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${getBaseUrl()}${url}`;
  const res = await fetch(fullUrl, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || json.code !== 0) {
    throw new Error(json.message || '请求失败');
  }

  return json.data;
}

/** 获取已发布的问卷列表 */
export async function getPublishedQuestionnaires(): Promise<Questionnaire[]> {
  return request<Questionnaire[]>(API_BASE);
}

/** 获取单个问卷详情 */
export async function getQuestionnaire(id: string): Promise<Questionnaire> {
  return request<Questionnaire>(`${API_BASE}/${id}`);
}

/** 提交问卷答案 */
export async function submitAnswer(
  id: string,
  answers: string[],
): Promise<Submission> {
  return request<Submission>(`${API_BASE}/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}
