/**
 * Axios 实例 + 统一拦截器
 *
 * 所有业务请求统一使用此实例，拦截器负责：
 *   请求侧：自动注入 token、统一 Content-Type
 *   响应侧：解包 { code, data, message }，统一错误处理
 */
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message as antdMessage } from 'antd';

// ===================== 后端统一响应结构 =====================
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

// ===================== 创建实例 =====================
const apiBase = (process.env.REACT_APP_API_BASE_URL ?? '').replace(/\/$/, '');

const http = axios.create({
  baseURL: apiBase || undefined, // 为空时走相对路径，由 craco proxy 转发
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================== 请求拦截器 =====================
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 自动注入 token（从 localStorage 取，视业务调整）
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    return Promise.reject(error);
  },
);

// ===================== 响应拦截器 =====================
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data: payload } = response;

    // 后端 code === 0 视为成功
    if (payload.code === 0) {
      return response;
    }

    // 业务错误：code !== 0
    const errMsg = payload.message || '请求异常';
    antdMessage.error(errMsg);
    return Promise.reject(new Error(errMsg));
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // HTTP 层错误
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || '';

      switch (status) {
        case 401:
          antdMessage.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          antdMessage.error(msg || '无权限访问');
          break;
        case 404:
          antdMessage.error(msg || '请求的资源不存在');
          break;
        case 500:
          antdMessage.error(msg || '服务器内部错误');
          break;
        default:
          antdMessage.error(msg || `请求失败 (${status})`);
      }
    } else if (error.code === 'ECONNABORTED') {
      antdMessage.error('请求超时，请稍后重试');
    } else {
      antdMessage.error('网络异常，请检查网络连接');
    }

    return Promise.reject(error);
  },
);

export default http;
