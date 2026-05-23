/**
 * 用户服务层
 *
 * 业务页面统一通过此文件调用用户相关接口。
 * mock / real 切换逻辑同问卷模块，由 REACT_APP_USE_MOCK 控制。
 */
import http from '../utils/request';
import type { ApiResponse } from '../utils/request';
import { userMockApi } from '../mocks/user';
import type { User, UserInput, UserQueryParams, UserRole, UserStatus } from '../mocks/user';

const useMock = process.env.REACT_APP_USE_MOCK === 'true';

// 真实接口（axios + 拦截器）
const realApi = {
  list: async (params: UserQueryParams): Promise<User[]> => {
    const res = await http.get<ApiResponse<User[]>>('/api/users', { params });
    return res.data.data;
  },

  create: async (input: UserInput): Promise<User> => {
    const res = await http.post<ApiResponse<User>>('/api/users', input);
    return res.data.data;
  },

  update: async (id: string, input: UserInput): Promise<User> => {
    const res = await http.put<ApiResponse<User>>(`/api/users/${id}`, input);
    return res.data.data;
  },

  remove: async (id: string): Promise<{ success: true }> => {
    const res = await http.delete<ApiResponse<{ success: true }>>(`/api/users/${id}`);
    return res.data.data;
  },
};

const api = useMock ? userMockApi : realApi;

export const fetchUsers = (params?: UserQueryParams): Promise<User[]> =>
  api.list(params ?? {});

export const createUser = (input: UserInput): Promise<User> => api.create(input);

export const updateUser = (id: string, input: UserInput): Promise<User> =>
  api.update(id, input);

export const removeUser = (id: string): Promise<{ success: true }> => api.remove(id);

export type { User, UserInput, UserQueryParams, UserRole, UserStatus };
