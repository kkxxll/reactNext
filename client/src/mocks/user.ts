/**
 * 用户模块 Mock 数据与接口
 */
import Mock, { Random } from 'mockjs';

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'disabled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface UserQueryParams {
  keyword?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
}

export type UserInput = Omit<User, 'id' | 'createdAt'>;

// ------------------- mockjs 模板：批量生成初始数据 -------------------

interface MockItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

const generated = Mock.mock({
  'list|18': [
    {
      'id|+1': 2000,
      name: '@cname',
      email: '@email',
      phone: /^1[3-9]\d{9}$/,
      'role|1': ['admin', 'editor', 'viewer'],
      'status|1': ['active', 'disabled'],
      createdAt: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  ],
}) as { list: MockItem[] };

let db: User[] = generated.list.map((item) => ({
  ...item,
  id: String(item.id),
}));

// ------------------- 工具函数 -------------------

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// ------------------- Mock 接口 -------------------

export const userMockApi = {
  list(params: UserQueryParams = {}): Promise<User[]> {
    const { keyword = '', role = 'all', status = 'all' } = params;
    const result = db.filter((item) => {
      const matchKw =
        keyword.trim() === '' ||
        item.name.includes(keyword.trim()) ||
        item.email.includes(keyword.trim());
      const matchRole = role === 'all' || item.role === role;
      const matchStatus = status === 'all' || item.status === status;
      return matchKw && matchRole && matchStatus;
    });
    return delay([...result]);
  },

  create(input: UserInput): Promise<User> {
    const item: User = {
      id: Random.string('number', 13),
      createdAt: Mock.mock('@now("yyyy-MM-dd HH:mm:ss")') as string,
      ...input,
    };
    db = [item, ...db];
    return delay(item);
  },

  update(id: string, input: UserInput): Promise<User> {
    const index = db.findIndex((it) => it.id === id);
    if (index === -1) return Promise.reject(new Error('用户不存在'));
    const updated: User = { ...db[index], ...input };
    db = db.map((it) => (it.id === id ? updated : it));
    return delay(updated);
  },

  remove(id: string): Promise<{ success: true }> {
    const exists = db.some((it) => it.id === id);
    if (!exists) return Promise.reject(new Error('用户不存在'));
    db = db.filter((it) => it.id !== id);
    return delay({ success: true } as const);
  },
};
