/**
 * 用户数据存储（内存版）
 */

const formatDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

let db = [
  {
    id: '2001',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-15 09:00:00',
  },
  {
    id: '2002',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13900139002',
    role: 'editor',
    status: 'active',
    createdAt: '2025-02-20 14:30:00',
  },
  {
    id: '2003',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13700137003',
    role: 'viewer',
    status: 'disabled',
    createdAt: '2025-03-10 11:20:00',
  },
  {
    id: '2004',
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '',
    role: 'editor',
    status: 'active',
    createdAt: '2025-04-05 16:45:00',
  },
];

const VALID_ROLES = ['admin', 'editor', 'viewer'];
const VALID_STATUSES = ['active', 'disabled'];

const validateInput = (input) => {
  if (!input || typeof input !== 'object') return '请求体格式错误';
  if (typeof input.name !== 'string' || input.name.trim() === '') return '姓名不能为空';
  if (input.name.length > 20) return '姓名最多 20 个字符';
  if (typeof input.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return '邮箱格式不正确';
  }
  if (input.phone && !/^1[3-9]\d{9}$/.test(input.phone)) return '手机号格式不正确';
  if (!VALID_ROLES.includes(input.role)) return '角色值非法';
  if (!VALID_STATUSES.includes(input.status)) return '状态值非法';
  return null;
};

const userStore = {
  list({ keyword = '', role = 'all', status = 'all' } = {}) {
    const kw = String(keyword).trim();
    return db.filter((item) => {
      const matchKw = kw === '' || item.name.includes(kw) || item.email.includes(kw);
      const matchRole = role === 'all' || item.role === role;
      const matchStatus = status === 'all' || item.status === status;
      return matchKw && matchRole && matchStatus;
    });
  },

  create(input) {
    const error = validateInput(input);
    if (error) return { error };
    const item = {
      id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name: input.name,
      email: input.email,
      phone: input.phone || '',
      role: input.role,
      status: input.status,
      createdAt: formatDateTime(new Date()),
    };
    db = [item, ...db];
    return { data: item };
  },

  update(id, input) {
    const error = validateInput(input);
    if (error) return { error };
    const index = db.findIndex((it) => it.id === id);
    if (index === -1) return { error: '用户不存在', notFound: true };
    const updated = {
      ...db[index],
      name: input.name,
      email: input.email,
      phone: input.phone || '',
      role: input.role,
      status: input.status,
    };
    db = db.map((it) => (it.id === id ? updated : it));
    return { data: updated };
  },

  remove(id) {
    const exists = db.some((it) => it.id === id);
    if (!exists) return { error: '用户不存在', notFound: true };
    db = db.filter((it) => it.id !== id);
    return { data: { success: true } };
  },
};

module.exports = { userStore };
